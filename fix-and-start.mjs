import fs from 'fs';
import { spawn } from 'child_process';

const p = '/data/.openclaw/openclaw.json';
const valid = ['pairing', 'allowlist', 'open', 'disabled'];

try {
  const c = JSON.parse(fs.readFileSync(p, 'utf8'));
  let patched = 0;
  for (const name of Object.keys(c.channels?.telegram?.accounts || {})) {
    const a = c.channels.telegram.accounts[name];
    if (!valid.includes(a.dmPolicy)) {
      console.log(`[fix] ${name}.dmPolicy (was: ${JSON.stringify(a.dmPolicy)}) -> "pairing"`);
      a.dmPolicy = 'pairing';
      patched++;
    }
  }
  if (patched > 0) {
    fs.writeFileSync(p, JSON.stringify(c, null, 2));
    console.log(`[fix] config patched (${patched} change(s))`);
  } else {
    console.log('[fix] config already valid');
  }
} catch (e) {
  console.error('[fix] failed to patch config:', e.message);
}

const child = spawn(
  'node',
  ['openclaw.mjs', 'gateway', '--allow-unconfigured', '--bind', 'lan', '--port', '8080'],
  { stdio: 'inherit', cwd: '/app' }
);
child.on('exit', code => process.exit(code ?? 0));
