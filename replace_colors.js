import fs from 'fs';
import path from 'path';

const replacements = [
  { from: /bg-emerald-500\/10/g, to: 'bg-white/5' },
  { from: /border-emerald-500\/20/g, to: 'border-white/10' },
  { from: /border-emerald-500\/30/g, to: 'border-white/10' },
  { from: /bg-emerald-500\/20/g, to: 'bg-white/10' },
  { from: /text-emerald-200/g, to: 'text-zinc-300' },
  { from: /text-emerald-300/g, to: 'text-zinc-200' },
  { from: /text-emerald-400/g, to: 'text-white' },
  { from: /text-emerald-500/g, to: 'text-white' },
  { from: /bg-emerald-500/g, to: 'bg-white' },
  { from: /hover:bg-emerald-400/g, to: 'hover:bg-zinc-200' },
  { from: /hover:border-emerald-500\/30/g, to: 'hover:border-white/20' },
  { from: /focus:text-emerald-400/g, to: 'focus:text-white' },
  { from: /focus:border-emerald-500/g, to: 'focus:border-white' },
  { from: /border-emerald-500/g, to: 'border-white' },
  { from: /rgba\(16,185,129,0\.2\)/g, to: 'rgba(255,255,255,0.05)' },
  { from: /rgba\(16,185,129,0\.3\)/g, to: 'rgba(255,255,255,0.05)' },
  { from: /rgba\(16,185,129,0\.4\)/g, to: 'rgba(255,255,255,0.1)' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      for (const rule of replacements) {
        newContent = newContent.replace(rule.from, rule.to);
      }
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir('./src');
