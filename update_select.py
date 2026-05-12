import os
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if 'selectSignal' in content:
        print(f"Updating {filepath}")
        content = content.replace('this.store.selectSignal', 'select')
        
        # update import
        if "import { Store, select }" not in content:
            content = content.replace("import { Store } from '@ngxs/store';", "import { Store, select } from '@ngxs/store';")
            
        with open(filepath, 'w') as f:
            f.write(content)

ts_files = glob.glob('src/app/**/*.ts', recursive=True)
for f in ts_files:
    process_file(f)
