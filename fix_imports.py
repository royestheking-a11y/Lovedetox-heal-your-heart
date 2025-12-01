import os
import re

def fix_imports(directory):
    # Regex to match imports ending with @version
    # Matches: from "pkg@1.2.3" or from 'pkg@1.2.3'
    # Captures the package name in group 1
    pattern = re.compile(r'from\s+[\'"](.+?)@\d+\.\d+\.\d+[\'"]')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                new_content = pattern.sub(r"from '\1'", content)
                
                if content != new_content:
                    print(f"Fixing {filepath}")
                    with open(filepath, 'w') as f:
                        f.write(new_content)

if __name__ == "__main__":
    fix_imports('./src')
