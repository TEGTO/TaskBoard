const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || 'https://localhost:44301';

const replaceInFile = (filePath, placeholder, value) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const updatedContent = fileContent.replace(new RegExp(placeholder, 'g'), value);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Replaced ${placeholder} in ${filePath}`);
};

const environmentFiles = [
    path.join(__dirname, 'src/environment/environment.ts'),
    path.join(__dirname, 'src/environment/environment.prod.ts')
];

environmentFiles.forEach(filePath => {
    replaceInFile(filePath, 'API_URL', apiUrl);
});
