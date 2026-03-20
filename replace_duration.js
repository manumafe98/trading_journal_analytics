const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const componentsDir = path.join(__dirname, 'components');
const files = walkDir(componentsDir);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('duration-500')) {
    const newContent = content.replace(/duration-500/g, 'duration-200');
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done replacing duration-500 with duration-200.');
