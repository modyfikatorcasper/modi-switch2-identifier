// Pure functions shared by the browser, validation and regression tests.
export function parseSerial(input) {
  const value = String(input).trim().toUpperCase().replace(/[\s-]/g, '');
  const match = value.match(/^([A-Z]{2,3})(\d{0,14})([*X•]{0,14})$/);
  if (!match || (match[1].length === 2 && (match[2] || match[3]))) return null;
  const letters = match[1], digits = match[2].slice(0, 6);
  return { fragment: letters + digits, completeFragment: letters.length === 3 && digits.length === 6,
    masked: letters + digits + (digits.length === 6 || match[3] ? '****' : '') };
}
export function batteryFor(fragment, rules) {
  const matches = rules.rules.filter(r => r.scope === 'battery' && fragment.startsWith(r.prefix));
  const values = new Set(matches.map(r => r.value));
  return { value: values.size > 1 ? 'conflict' : matches[0]?.value || 'unknown', rules: matches };
}
export function lookup(input, reports, rules) {
  const serial = parseSerial(input);
  if (!serial) return { valid: false };
  const matches = reports.filter(r => r.serialFragment.startsWith(serial.fragment));
  const battery = batteryFor(serial.fragment, rules);
  const confirmed = matches.filter(r => r.panelModel && r.evidenceStatuses.includes('panel-confirmed') && r.evidence.length);
  const conflict = battery.value === 'conflict' || matches.some(r => r.evidenceStatuses.includes('conflicting') ||
    (r.batteryObserved !== 'unknown' && battery.value !== 'unknown' && r.batteryObserved !== battery.value)) ||
    new Set(confirmed.map(r => r.panelModel)).size > 1;
  // Observations for the same masked fragment never identify the visitor's console.
  return { valid: true, serial, battery, matches, confirmed, conflict, screen: 'unknown' };
}
export function filterReports(reports, filters, rules) {
  return reports.filter(r => (!filters.prefix || r.serialFragment.startsWith(filters.prefix.toUpperCase().trim())) &&
    (!filters.panel || (r.panelModel || 'unknown') === filters.panel) &&
    (!filters.battery || batteryFor(r.serialFragment, rules).value === filters.battery) &&
    (!filters.country || (r.country || 'unknown') === filters.country) &&
    (!filters.status || r.evidenceStatuses.includes(filters.status)) &&
    (!filters.history || (filters.history === 'any-replaced' ? r.screenHistory === 'replaced' || r.boardHistory === 'replaced' :
      filters.history.startsWith('screen:') ? r.screenHistory === filters.history.slice(7) : r.boardHistory === filters.history.slice(6))));
}
export function redactSerials(text) {
  return String(text).replace(/([A-Z]{3}\d{6})\d+/gi, '$1****');
}
export function sanitizeDraft(entries) {
  const draft = Object.fromEntries([...entries].map(([k, v]) => [k, redactSerials(v)]));
  const serial = parseSerial(draft.serial);
  if (!serial?.completeFragment) throw new Error('serial-fragment-required');
  draft.serial = serial.masked;
  return draft;
}
export function repositoryFor(config, location) {
  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(config.githubRepository)) return config.githubRepository;
  if (/^[a-z0-9-]+\.github\.io$/i.test(location.hostname)) {
    const owner = location.hostname.split('.')[0];
    const part = location.pathname.split('/').filter(Boolean)[0];
    return owner + '/' + (part && part !== 'index.html' ? part : owner + '.github.io');
  }
  return null;
}
export function issueUrl(repository, draft, language) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || '')) return null;
  const safe = sanitizeDraft(Object.entries(draft));
  const params = new URLSearchParams({ template: `report-${language}.yml`, ...safe });
  return `https://github.com/${repository}/issues/new?${params}`;
}
export function toCSV(reports, rules) {
  const headers = ['report_id','serial_masked','panel_model','assembly_style','battery_prefix_rule','battery_observed','country','purchase_month','evidence_statuses','screen_history','board_history','duplicate_review','source_ids','issue_url'];
  const rows = reports.map(r => [r.id,r.serialMasked,r.panelModel || '',r.assemblyStyle,batteryFor(r.serialFragment,rules).value,r.batteryObserved,r.country || '',r.purchaseMonth || '',r.evidenceStatuses.join('|'),r.screenHistory,r.boardHistory,r.duplicateReview,r.sourceIds.join('|'),r.issueUrl || '']);
  const escape = value => { let s = String(value); if (/^[=+\-@\t\r\n]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
  return '\uFEFF' + [headers,...rows].map(row => row.map(escape).join(',')).join('\r\n') + '\r\n';
}
