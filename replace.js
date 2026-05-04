const fs = require('fs');
const path = require('path');

const files = [
  'AdminBookings.tsx',
  'AdminDashboard.tsx',
  'AdminDelegation.tsx',
  'AdminLogin.tsx',
  'AdminProcedures.tsx',
  'AdminProfessionals.tsx',
  'ReceptionDashboard.tsx'
];

const dir = path.join(__dirname, 'src/views/admin');

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace bg-card with bg-white
  content = content.replace(/\bbg-card\b/g, 'bg-white');

  // Replace text-foreground and text-on-surface with text-black
  // Use regex to avoid matching text-muted-foreground
  content = content.replace(/(?<!-)\btext-foreground\b/g, 'text-black');
  content = content.replace(/(?<!-)\btext-on-surface\b/g, 'text-black');

  // Replace shadow-sm with shadow-lg for floating effect
  content = content.replace(/\bshadow-sm\b/g, 'shadow-lg');
  
  // Also replace hover:shadow-md with hover:shadow-xl to maintain the hover effect proportionally
  content = content.replace(/\bhover:shadow-md\b/g, 'hover:shadow-xl');

  // Some blocks might not have shadow-sm, let's make sure blocks (bg-white) have shadow-lg
  // It's safer to just let the script run and then we can review if any block missed a shadow.
  // Actually, we can just replace bg-white with bg-white shadow-lg if we want to force it, but let's see.
  // To avoid duplicates, let's just do it manually if needed, or:
  content = content.replace(/\bbg-white\b(?!.*shadow)/g, 'bg-white shadow-lg');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done');
