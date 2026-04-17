import fs from 'fs';
const p = '/data/.openclaw/openclaw.json';
const c = JSON.parse(fs.readFileSync(p, 'utf8'));
const valid = ['pairing', 'allowlist', 'open', 'disabled'];
for (const name of Object.keys(c.channels?.telegram?.accounts || {})) {
  const a = c.channels.telegram.accounts[name];
  if (!valid.includes(a.dmPolicy)) {
    console.log(`patching ${name}.dmPolicy (was: ${a.dmPolicy})`);
    a.dmPolicy = 'pairing';
  }
}
fs.writeFileSync(p, JSON.stringify(c, null, 2));
console.log('config patched');
