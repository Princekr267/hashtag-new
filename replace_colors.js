import fs from 'fs';

const files = [
  'src/index.css',
  'src/pages/Home.tsx',
  'src/components/GyroOrb.tsx',
  'src/components/HeroOrb.tsx',
  'src/components/Wireframe3D.tsx',
  'tailwind.config.js'
];

/** 
 * Deep Navy -> Pure Black
 * Primary: (Electric Blue / 96, 165, 250) -> Neon Cyan (0, 255, 204)
 * Secondary: (Indigo / 129, 140, 248) -> Purple (176, 38, 255)
 * Tertiary: (Sky / 56, 189, 248) -> Pink (255, 0, 127)
 * Other replacements to match dark theme.
 */

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let text = fs.readFileSync(file, 'utf8');

  // Hex Colors
  text = text.replace(/#60a5fa/gi, '#00ffcc');
  text = text.replace(/#818cf8/gi, '#b026ff');
  text = text.replace(/#38bdf8/gi, '#ff007f');
  
  text = text.replace(/#8ff5ff/gi, '#00ffcc'); // light cyan -> neon cyan
  text = text.replace(/#00fc40/gi, '#00ffcc'); // neon green -> neon cyan
  text = text.replace(/#ac89ff/gi, '#b026ff'); // light purple -> purple
  
  // RGB tuples
  text = text.replace(/96,\s*165,\s*250/g, '0, 255, 204');
  text = text.replace(/129,\s*140,\s*248/g, '176, 38, 255');
  text = text.replace(/56,\s*189,\s*248/g, '255, 0, 127');
  
  text = text.replace(/143,\s*245,\s*255/g, '0, 255, 204');
  text = text.replace(/0,\s*252,\s*64/g, '0, 255, 204');
  text = text.replace(/172,\s*137,\s*255/g, '176, 38, 255');

  // Backgrounds for index.css
  if (file.includes('index.css')) {
    text = text.replace(/--bg-base:\s*#030b1a/g, '--bg-base:          #000000');
    text = text.replace(/--bg-container:\s*#071428/g, '--bg-container:     #080808');
    text = text.replace(/--bg-container-hi:\s*#0c1e3d/g, '--bg-container-hi:  #111111');
    text = text.replace(/--bg-container-top:\s*#112348/g, '--bg-container-top: #1a1a1a');
    text = text.replace(/--bg-bright:\s*#172d58/g, '--bg-bright:        #222222');
    text = text.replace(/rgba\(7,\s*20,\s*40/g, 'rgba(10, 10, 10');
    text = text.replace(/rgba\(3,\s*11,\s*26/g, 'rgba(0, 0, 0');
  }

  // tailwind config colors
  if (file.includes('tailwind.config.js')) {
    text = text.replace(/'#0e0e10'/g, "'#000000'");
    text = text.replace(/'#19191c'/g, "'#0a0a0a'");
    text = text.replace(/'#1f1f22'/g, "'#111111'");
    text = text.replace(/'#262528'/g, "'#1a1a1a'");
    text = text.replace(/'#2c2c2f'/g, "'#222222'");
  }

  fs.writeFileSync(file, text, 'utf8');
}

console.log('Colors replaced!');
