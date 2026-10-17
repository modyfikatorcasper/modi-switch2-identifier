import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseSerial,lookup,batteryFor,filterReports,redactSerials,sanitizeDraft,repositoryFor,issueUrl,toCSV} from '../assets/core.js';
import {validate} from '../scripts/validate.mjs';
const observations=JSON.parse(await readFile(new URL('../data/observations.json',import.meta.url)));
const rules=JSON.parse(await readFile(new URL('../data/rules.json',import.meta.url)));
const reports=observations.reports;
test('full and masked serials produce the same privacy-safe lookup',()=>{
  const full=lookup('hle4009249876',reports,rules),masked=lookup('HLE400924****',reports,rules);
  assert.deepEqual(full,masked);assert.equal(full.matches[0].id,'MODI-0001');
  assert.equal(full.serial.masked,'HLE400924****');assert.ok(!JSON.stringify(full).includes('9876'));
});
test('supports X masks, whitespace, case and both seed fragments',()=>{
  assert.equal(parseSerial(' hae 109492 XXXX ').masked,'HAE109492****');
  assert.equal(lookup('HAE1094921234',reports,rules).matches[0].id,'MODI-0002');
});
test('HA and HL infer only battery construction',()=>{
  assert.equal(lookup('HA',reports,rules).battery.value,'earlier');
  assert.equal(lookup('HL',reports,rules).battery.value,'user-replaceable');
  assert.equal(lookup('HLE400924****',reports,rules).screen,'unknown');
  assert.equal(reports[0].panelModel,null);assert.equal(reports[1].panelModel,null);
});
test('unknown fragments keep screens unknown even with a documented battery',()=>{
  assert.equal(lookup('HLE9999991234',reports,rules).matches.length,0);
  assert.equal(lookup('HLE9999991234',reports,rules).battery.value,'user-replaceable');
  assert.equal(lookup('XYZ123456****',reports,rules).battery.value,'unknown');
  assert.equal(lookup('XYZ123456****',reports,rules).screen,'unknown');
});
test('invalid input, HTML, URLs and ambiguous two-letter numeric input are rejected',()=>{
  for(const text of ['', '<script>alert(1)</script>','https://example.com','HL123','123456','HLE400924oops','HLE40?'])assert.equal(parseSerial(text),null,text);
});
// Synthetic fixtures are test-only; they are never copied into the published site.
const confirmedFixture=(id,panel)=>({...reports[0],id,panelModel:panel,evidenceStatuses:['panel-confirmed'],evidence:[{kind:'panel-marking',url:'https://example.org/test',sameUnit:true,readable:true}]});
test('conflicting reported models never become a screen prediction',()=>{
  const result=lookup('HLE4009249876',[confirmedFixture('TEST-A','ZD079KA-03A'),confirmedFixture('TEST-B','LS079T1SX10P')],rules);
  assert.equal(result.matches.length,2);assert.equal(result.confirmed.length,2);assert.equal(result.conflict,true);assert.equal(result.screen,'unknown');
});
test('a matching masked report, even confirmed, never identifies the visitor console',()=>{
  const result=lookup('HLE400924****',[confirmedFixture('TEST-A','ZD079KA-03A')],rules);
  assert.equal(result.conflict,false);assert.equal(result.screen,'unknown');
});
test('battery evidence that contradicts prefix rules is surfaced',()=>{
  assert.equal(lookup('HLE400924****',[{...reports[0],batteryObserved:'earlier'}],rules).conflict,true);
  const conflictingRules={...rules,rules:[...rules.rules,{...rules.rules[1],id:'test-conflict',value:'earlier'}]};
  assert.equal(batteryFor('HLE',conflictingRules).value,'conflict');
});
test('all six database filters compose and reset without inventing records',()=>{
  assert.equal(filterReports(reports,{},rules).length,2);
  for(const [key,value] of Object.entries({prefix:'HLE',panel:'unknown',battery:'user-replaceable',country:'unknown',status:'unverified',history:'screen:unknown'}))assert.ok(filterReports(reports,{[key]:value},rules).some(r=>r.id==='MODI-0001'));
  assert.equal(filterReports(reports,{prefix:'HLE',battery:'earlier'},rules).length,0);
  assert.equal(filterReports(reports,{status:'panel-confirmed'},rules).length,0);
  assert.equal(filterReports(reports,{history:'any-replaced'},rules).length,0);
  assert.equal(filterReports(reports,{prefix:'HAE',history:'board:unknown'},rules).length,1);
});
test('draft and GitHub URL redact serials in every text field',()=>{
  const draft=sanitizeDraft([['serial','HLE400924****'],['notes','HLE4009249876 / hae1094921234'],['country','Poland']]);
  assert.equal(draft.notes,'HLE400924**** / hae109492****');
  const url=issueUrl('sample/modi',draft,'en');assert.ok(url.includes('report-en.yml'));assert.ok(!decodeURIComponent(url).includes('9876'));assert.ok(!decodeURIComponent(url).includes('1234'));
  assert.equal(issueUrl('',draft,'pl'),null);assert.equal(issueUrl('https://evil.test/x',draft,'pl'),null);
  assert.throws(()=>sanitizeDraft([['serial','HL']]));assert.equal(redactSerials('plain text'),'plain text');
});
test('repository resolution supports project Pages, user Pages and explicit custom-domain config',()=>{
  assert.equal(repositoryFor({githubRepository:''},{hostname:'owner.github.io',pathname:'/modi/'}),'owner/modi');
  assert.equal(repositoryFor({githubRepository:''},{hostname:'owner.github.io',pathname:'/'}),'owner/owner.github.io');
  assert.equal(repositoryFor({githubRepository:'owner/modi'},{hostname:'custom.test',pathname:'/'}),'owner/modi');
  assert.equal(repositoryFor({githubRepository:''},{hostname:'127.0.0.1',pathname:'/'}),null);
});
test('CSV preserves report IDs and masks, escapes quotes and neutralizes formulas',()=>{
  const csv=toCSV([{...reports[0],country:'=HYPERLINK("x")'}],rules);
  assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('MODI-0001'));assert.ok(csv.includes('HLE400924****'));assert.ok(csv.includes('"\'=HYPERLINK(""x"")"'));assert.ok(csv.endsWith('\r\n'));
});
test('production dataset and evidence invariants are valid',validate);
