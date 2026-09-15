const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Khani-RTX\\.gemini\\antigravity-ide\\scratch\\malaika-fabrics';

const files = ['index.html', 'collections.html', 'wholesale.html', 'products.html', 'contact.html'];

const searchStr = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="5" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="12" cy="19" r="1.5"></circle>
        </svg>`;

const replacementStr = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <circle cx="12" cy="5" r="2"></circle>
          <circle cx="12" cy="12" r="2"></circle>
          <circle cx="12" cy="19" r="2"></circle>
        </svg>`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(searchStr, replacementStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
