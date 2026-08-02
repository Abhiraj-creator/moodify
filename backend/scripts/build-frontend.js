const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', '..', 'frontend');
const backendPublicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(frontendDir)) {
    throw new Error('Frontend directory not found');
}

console.log('Building frontend...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

if (!fs.existsSync(path.join(frontendDir, 'dist'))) {
    throw new Error('Frontend build output was not created');
}

fs.rmSync(backendPublicDir, { recursive: true, force: true });
fs.mkdirSync(backendPublicDir, { recursive: true });
fs.cpSync(path.join(frontendDir, 'dist'), backendPublicDir, { recursive: true });

console.log('Frontend copied to backend/public');
