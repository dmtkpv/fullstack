import { spawn } from 'child_process';
const [nodePath, scriptPath, script, ...args] = process.argv;

if (script) {
    spawn('node', [`./scripts/${script}.js`, ...args], { stdio: 'inherit' });
}