import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = isWindows ? 'node.exe' : 'node';

console.log('\n======================================================');
console.log('  STARTING HOTELPRO FULL-STACK APPLICATION (MERN)');
console.log('======================================================\n');

// Start backend
const serverProcess = spawn(
  npmCmd,
  ['run', 'dev'],
  {
    cwd: path.join(rootDir, 'server'),
    stdio: 'inherit',
    shell: true
  }
);

// Start frontend
const clientProcess = spawn(
  npmCmd,
  ['run', 'dev'],
  {
    cwd: path.join(rootDir, 'client'),
    stdio: 'inherit',
    shell: true
  }
);

const handleExit = () => {
  console.log('\n[HotelPro] Terminating development processes...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
