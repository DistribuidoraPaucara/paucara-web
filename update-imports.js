#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const importMappings = {
    "@/domain/": "@/domain/entities/",
    "@/services/": "@/infrastructure/services/",
    "@/pages/": "@/presentation/pages/",
    "@/components/": "@/presentation/components/"
};

function updateImportsInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        Object.entries(importMappings).forEach(([oldPath, newPath]) => {
            const regex = new RegExp(`(['"])${oldPath.replace('/', '\\/')}`, 'g');
            if (regex.test(content)) {
                content = content.replace(regex, `$1${newPath}`);
                hasChanges = true;
            }
        });

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

async function main() {
    try {
        const files = await glob('resources/js/**/*.{ts,tsx}', {
            cwd: process.cwd(),
            ignore: ['resources/js/domain/entities/**', 'resources/js/infrastructure/services/**',
                'resources/js/presentation/**']
        });

        console.log(`Found ${files.length} files to update`);

        files.forEach(updateImportsInFile);

        console.log('Import update completed!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();