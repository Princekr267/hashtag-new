const fs = require('fs');
const path = require('path');

// Define paths
const projectRoot = __dirname;
const logoSource = path.join(projectRoot, 'To-be-added', 'hashtag-logo.png');
const srcAssetsImagesDir = path.join(projectRoot, 'src', 'assets', 'images');
const publicImagesDir = path.join(projectRoot, 'public', 'images');
const srcDestination = path.join(srcAssetsImagesDir, 'hashtag-logo.png');
const publicDestination = path.join(publicImagesDir, 'hashtag-logo.png');

// Create directories
console.log('Creating directories...');
if (!fs.existsSync(srcAssetsImagesDir)) {
  fs.mkdirSync(srcAssetsImagesDir, { recursive: true });
  console.log('Created: ' + srcAssetsImagesDir);
}
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log('Created: ' + publicImagesDir);
}

// Copy files
console.log('\nCopying logo file...');
if (fs.existsSync(logoSource)) {
  fs.copyFileSync(logoSource, srcDestination);
  console.log('Copied to: ' + srcDestination);
  
  fs.copyFileSync(logoSource, publicDestination);
  console.log('Copied to: ' + publicDestination);
} else {
  console.error('Logo source not found: ' + logoSource);
  process.exit(1);
}

console.log('\n✓ Logo setup completed successfully!');
