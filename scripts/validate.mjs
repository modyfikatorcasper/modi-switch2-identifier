import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export async function validate() {
  const read=async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url),'utf8'));
  const [observations,rules,sources,panels,images,config]=await Promise.all(['observations','rules','sources','panels','reference-images','config'].map(read));
  const sourceIds=new Set(sources.map(s=>s.id)),panelIds=new Set(panels.map(p=>p.id));
  assert.equal(sourceIds.size,sources.length,'Duplicate source IDs');
  assert.equal(panelIds.size,panels.length,'Duplicate panel IDs');
  const ids=new Set();
  const enums={evidenceStatuses:['unverified','construction-photo','panel-confirmed','conflicting','screen-replaced','screen-unknown'],history:['factory','replaced','unknown'],battery:['earlier','user-replaceable','unknown']};
  const http=value=>{assert.match(value,/^https:\/\//);assert.doesNotThrow(()=>new URL(value));};
  const refs=(record)=>{assert.ok(record.sourceIds?.length,'Source required');for(const id of record.sourceIds)assert.ok(sourceIds.has(id),`Missing source ${id}`);};
  const bilingual=value=>{assert.ok(value?.pl&&value?.en,'PL and EN text required');};
  assert.equal(rules.screenPredictionEnabled,false,'Screen prediction must remain disabled');
  assert.equal(observations.schemaVersion,1);assert.equal(rules.schemaVersion,1);
  assert.ok(!config.githubRepository || /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(config.githubRepository),'Invalid repository');
  for(const r of [...rules.rules,...rules.constraints]){refs(r);bilingual(r.rationale);}
  for(const r of rules.rules){assert.equal(r.scope,'battery');assert.ok(enums.battery.includes(r.value));assert.match(r.prefix,/^[A-Z]{2,3}$/);}
  for(const s of sources)if(s.url)http(s.url);
  for(const p of panels){refs(p);bilingual(p.description);assert.equal(p.measuredParameters,null,'Add measurement review before publishing metrics');}
  for(const image of images){refs(image);http(image.url);assert.ok(panelIds.has(image.panelId));assert.ok(image.credit&&image.rights);bilingual(image.observed);}
  for(const r of observations.reports) {
    assert.ok(!ids.has(r.id),'Duplicate report ID');ids.add(r.id);assert.match(r.id,/^MODI-\d{4,}$/);
    assert.match(r.serialFragment,/^[A-Z]{3}\d{6}$/);assert.equal(r.serialMasked,r.serialFragment+'****');
    refs(r);bilingual(r.notes);assert.ok(r.panelModel===null||panelIds.has(r.panelModel),'Panel must be catalogued');
    assert.ok(enums.battery.includes(r.batteryObserved));
    assert.ok(enums.history.includes(r.screenHistory)&&enums.history.includes(r.boardHistory));
    assert.ok(r.evidenceStatuses.length>0&&r.evidenceStatuses.every(s=>enums.evidenceStatuses.includes(s)));
    assert.ok(['unknown','original-style','other'].includes(r.assemblyStyle));
    assert.ok(['not-reviewed','possible-duplicate','reviewed'].includes(r.duplicateReview));
    assert.ok(r.features&&Array.isArray(r.evidence));
    for(const key of ['wideRibbonPrint','leftWing','rightWing'])assert.ok(['unknown','present','absent','unreadable','unresolved'].includes(r.features[key]));
    for(const key of ['ribbonTip','smallConnector','underBoardRoute'])assert.ok(r.features[key]===null||typeof r.features[key]==='string');
    if(r.issueUrl)http(r.issueUrl);
    if(r.purchaseMonth)assert.match(r.purchaseMonth,/^\d{4}-(0[1-9]|1[0-2])$/);
    for(const evidence of r.evidence){http(evidence.url);assert.ok(['panel-marking','construction','serial-link','battery'].includes(evidence.kind));assert.equal(typeof evidence.sameUnit,'boolean');assert.equal(typeof evidence.readable,'boolean');}
    if(r.evidenceStatuses.includes('panel-confirmed')){assert.ok(r.panelModel);assert.ok(r.evidence.some(e=>e.kind==='panel-marking'&&e.sameUnit&&e.readable),'Confirmation requires a legible same-unit marking photo');assert.ok(r.evidence.some(e=>e.kind==='serial-link'&&e.sameUnit),'Confirmation requires a same-unit serial link');assert.ok(!r.evidenceStatuses.includes('screen-unknown'));}
    if(r.evidenceStatuses.includes('construction-photo'))assert.ok(r.evidence.some(e=>e.kind==='construction'&&e.sameUnit),'Construction status requires same-unit photos');
    if(!r.evidence.length){assert.ok(r.evidenceStatuses.includes('screen-unknown'));assert.ok(!r.evidenceStatuses.includes('panel-confirmed'));}
    if(r.screenHistory==='replaced')assert.ok(r.evidenceStatuses.includes('screen-replaced'));
    // A masked fragment may collide. IDs are unique; fragments need not be.
  }
  const raw=JSON.stringify({observations,rules,panels,images});
  assert.ok(!/[A-Z]{3}\d{7,}/.test(raw),'Potential unmasked serial in published data');
  console.log(`Data valid: ${ids.size} reports, ${panels.length} panel markings, ${rules.rules.length} battery rules.`);
  return true;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await validate();
