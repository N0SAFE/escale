const { spawnSync, spawn } = require('child_process');

spawnSync('npm run build:api', { stdio: 'inherit', shell: true });
spawn('npm run start:api', { stdio: 'inherit', shell: true });
setTimeout(() => {
  spawnSync('npm run build:front', { stdio: 'inherit', shell: true });
  process.exit(0);
}, 5000);