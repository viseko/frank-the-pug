#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectName = process.argv[2];

if (!projectName) {
console.error("Please provide a project name.");
process.exit(1);
}

const targetDir = path.join(process.cwd(), projectName);

if (fs.existsSync(targetDir)) {
console.error(
    `Project directory ${projectName} already exists. Please choose a different name or delete the existing directory.`
);
process.exit(1);
}

try {
fs.mkdirSync(targetDir, { recursive: true });
console.log(`Created directory: ${targetDir}`);
} catch (error) {
console.error(`Error creating directory ${targetDir}:`, error);
process.exit(1);
}

function copyRecursiveSync(src, dest) {
const exists = fs.existsSync(src);
const stats = exists && fs.statSync(src);
const isDirectory = exists && stats.isDirectory();
if (isDirectory) {
    if (!fs.existsSync(dest)) {
     fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
     copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
     );
    });
} else {
    fs.copyFileSync(src, dest);
}
}

const templateDir = path.join(__dirname, "template");
try {
copyRecursiveSync(templateDir, targetDir);
console.log(`Copied files from ${templateDir} to ${targetDir}`);

// Переименование gitignore.template в .gitignore
const gitignoreSrc = path.join(templateDir, "gitignore.template");
const gitignoreDest = path.join(targetDir, ".gitignore");
if (fs.existsSync(gitignoreSrc)) {
    fs.copyFileSync(gitignoreSrc, gitignoreDest);
    console.log("Copied and renamed gitignore.template to .gitignore");
}

// Переименование !ftp.js в ftp.js
const ftpConfigSrc = path.join(targetDir, "gulp", "config", "!ftp.js");
const ftpConfigDest = path.join(targetDir, "gulp", "config", "ftp.js");
if (fs.existsSync(ftpConfigSrc)) {
    fs.renameSync(ftpConfigSrc, ftpConfigDest);
    console.log("Renamed !ftp.js to ftp.js");
}
} catch (error) {
console.error(`Error copying files:`, error);
process.exit(1);
}

try {
execSync(`cd ${projectName} && npm install`, { stdio: "inherit" });
console.log(`Installed dependencies for ${projectName}`);
} catch (error) {
console.error(`Error installing dependencies:`, error);
process.exit(1);
}

console.log(`Project ${projectName} created successfully.`);