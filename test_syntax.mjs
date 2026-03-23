import fs from 'fs';

const code = fs.readFileSync('./src/components/projects-view.js', 'utf8');
try {
  new Function(code);
  console.log('No syntax errors in projects-view.js');
} catch (e) {
  console.error('Syntax error:', e);
}
