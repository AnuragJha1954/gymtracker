import fs from 'fs';
import path from 'path';

const replacements = [
  // Backgrounds
  { from: /bg-\[\#0c0c0e\]/g, to: 'bg-[#141A25]' },
  { from: /bg-\[\#121214\]/g, to: 'bg-[#1C2433]' },
  { from: /bg-\[\#18181b\]/g, to: 'bg-[#141A25]' },
  { from: /bg-\[\#09090b\]/g, to: 'bg-[#0B111A]' },
  { from: /bg-\[\#111827\]/g, to: 'bg-[#141A25]' },
  
  // Borders
  { from: /border-\[\#27272a\]/g, to: 'border-[#263143]' },
  { from: /border-\[\#1f2937\]/g, to: 'border-[#263143]' },
  
  // Zinc to Slate text
  { from: /text-zinc-200/g, to: 'text-slate-200' },
  { from: /text-zinc-300/g, to: 'text-slate-300' },
  { from: /text-zinc-400/g, to: 'text-slate-400' },
  { from: /text-zinc-500/g, to: 'text-slate-500' },
  { from: /text-zinc-600/g, to: 'text-slate-600' },
  { from: /text-zinc-950/g, to: 'text-[#0B111A]' },
  
  // White accents (from previous step) to Cyan
  { from: /bg-white\/5/g, to: 'bg-[#14F1D9]/10' },
  { from: /bg-white\/10/g, to: 'bg-[#14F1D9]/20' },
  { from: /border-white\/10/g, to: 'border-[#14F1D9]/20' },
  { from: /border-white\/20/g, to: 'border-[#14F1D9]/30' },
  { from: /border-white/g, to: 'border-[#14F1D9]' },
  
  // The primary buttons were set to bg-white
  { from: /bg-white/g, to: 'bg-[#14F1D9]' },
  { from: /hover:bg-zinc-200/g, to: 'hover:bg-[#0ED4BF]' },
  { from: /focus:border-white/g, to: 'focus:border-[#14F1D9]' },
  
  // Glows
  { from: /rgba\(255,255,255,0\.05\)/g, to: 'rgba(20,241,217,0.1)' },
  { from: /rgba\(255,255,255,0\.1\)/g, to: 'rgba(20,241,217,0.2)' },
  
  // Rounding tweaks to match reference
  { from: /rounded-2xl/g, to: 'rounded-[20px]' },
  { from: /rounded-3xl/g, to: 'rounded-[24px]' },
  
  // Button rounding
  { from: /rounded-\[20px\] max-w-xs py-4/g, to: 'rounded-full max-w-xs py-4' },
  { from: /rounded-\[20px\] shadow-lg/g, to: 'rounded-full shadow-lg' },
];

function processFile(fullPath) {
  let content = fs.readFileSync(fullPath, 'utf8');
  let newContent = content;
  for (const rule of replacements) {
    newContent = newContent.replace(rule.from, rule.to);
  }
  
  // Special fix for the text-white that should be cyan
  // In GymTracker.jsx, we want some text-white to be text-[#14F1D9]
  if (fullPath.includes('GymTracker.jsx')) {
     newContent = newContent.replace(/text-white bg-\[\#27272a\]/g, 'text-slate-200 bg-[#263143]');
     newContent = newContent.replace(/text-3xl font-black text-white/g, 'text-3xl font-black text-[#14F1D9]');
     newContent = newContent.replace(/text-emerald-400/g, 'text-[#14F1D9]'); // catch any missed ones
  }
  
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log('Updated ' + fullPath);
  }
}

['src/screens/GymTracker.jsx', 'src/screens/AuthScreen.jsx', 'src/components/InstallPrompt.jsx'].forEach(processFile);
