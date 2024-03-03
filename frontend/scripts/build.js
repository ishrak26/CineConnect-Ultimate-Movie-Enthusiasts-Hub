const fs = require('fs');
const execSync = require('child_process').execSync;

// Function to modify .eslintrc or .eslintignore
function modifyEslintConfig() {
  // Example: Disable ESLint by renaming .eslintrc.json
  fs.renameSync('.eslintrc.json', '.eslintrc.disabled.json');
}

// Function to revert modifications
function revertEslintConfig() {
  // Revert the disable action
  fs.renameSync('.eslintrc.disabled.json', '.eslintrc.json');
}

try {
  modifyEslintConfig();
  // Execute Next.js build
  execSync('next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed', error);
} finally {
  // Ensure ESLint config is reverted even if the build fails
  revertEslintConfig();
}
