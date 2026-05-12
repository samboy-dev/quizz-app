const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src/app');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('selectSignal')) {
        console.log(`Updating ${file}`);
        content = content.replace(/this\.store\.selectSignal/g, 'select');
        
        if (!content.includes('import { Store, select }')) {
            content = content.replace(/import { Store } from '@ngxs\/store';/g, "import { Store, select } from '@ngxs/store';");
        }
        
        fs.writeFileSync(file, content);
    }
});
