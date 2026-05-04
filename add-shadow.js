const fs = require('fs');
const path = require('path');
const files = ['AdminBookings.tsx','AdminDashboard.tsx','AdminDelegation.tsx','AdminLogin.tsx','AdminProcedures.tsx','AdminProfessionals.tsx','ReceptionDashboard.tsx'];
const dir = path.join(__dirname, 'src/views/admin');
for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/className=\"([^"]*bg-white[^"]*)\"/g, (match, p1) => {
    if (!p1.includes('shadow-lg') && !p1.includes('shadow-2xl')) {
      // Add shadow-lg to the class string
      const newClasses = p1.replace('bg-white', 'bg-white shadow-lg');
      return `className="${newClasses}"`;
    }
    return match;
  });
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done');
