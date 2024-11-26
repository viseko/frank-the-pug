import fs from "fs";
import path from "path";
import chalk from "chalk";

// Директории, в которых будем искать компоненты
const rootDirs = ["src/shared", "src/widgets"];

// Функция для создания файлов index.pug и index.scss, если их нет
function createIndexFiles(dir) {
  const pugIndex = path.join(dir, "index.pug");
  const scssIndex = path.join(dir, "index.scss");

  if (!fs.existsSync(pugIndex)) {
    fs.writeFileSync(pugIndex, "", "utf8");
    console.log(chalk.green(`Created ${pugIndex}`));
  }

  return { pugIndex, scssIndex: fs.existsSync(scssIndex) ? scssIndex : null };
}

// Функция для добавления импортов в файлы, если их еще нет
function addImport(filePath, importStatement) {
  const existingContent = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "";
  const importWithNewLine = `${importStatement}\n`;

  if (!existingContent.includes(importWithNewLine.trim())) {
    fs.appendFileSync(filePath, importWithNewLine, "utf8");
    console.log(chalk.blue(`Added import to ${filePath}: ${importStatement}`));
  }
}

// Функция для удаления импортов из файлов
function removeImport(filePath, importStatement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    const importWithNewLine = `${importStatement}\n`;
    content = content.replace(importWithNewLine, "");

    fs.writeFileSync(filePath, content, "utf8");
    console.log(
      chalk.red(`Removed import from ${filePath}: ${importStatement}`)
    );
  }
}

// Рекурсивная функция для обхода директорий
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!["themes", "sizes", "lib"].includes(file)) {
        callback(fullPath);
        walkDir(fullPath, callback);
      }
    }
  });
}

// Функция для добавления и удаления импортов в файлы Pug и SCSS
function updateImports() {
  console.log(chalk.yellow("Starting to update imports..."));

  // Проход по корневым директориям
  rootDirs.forEach((rootDir) => {
    walkDir(rootDir, (subDir) => {
      const { pugIndex, scssIndex } = createIndexFiles(subDir);

      // Список существующих поддиректорий
      const existingDirs = fs
        .readdirSync(subDir)
        .filter(
          (file) =>
            fs.statSync(path.join(subDir, file)).isDirectory() &&
            !["themes", "sizes", "lib"].includes(file)
        );

      // Добавление импортов компонентов в index-файлы поддиректорий
      existingDirs.forEach((dir) => {
        const componentPugIndex = path.join(subDir, dir, "index.pug");
        const componentScssIndex = path.join(subDir, dir, "index.scss");

        if (fs.existsSync(componentPugIndex)) {
          const pugImport = `include ${path
            .relative(path.dirname(pugIndex), componentPugIndex)
            .replace(/\\/g, "/")
            .replace("/index.pug", "/index")}`;
          addImport(pugIndex, pugImport);
        } else {
          const pugImport = `include ${path
            .relative(path.dirname(pugIndex), path.join(subDir, dir, "index"))
            .replace(/\\/g, "/")
            .replace("/index.pug", "/index")}`;
          removeImport(pugIndex, pugImport);
        }

        if (scssIndex) {
          if (fs.existsSync(componentScssIndex)) {
            const scssImport = `@import "${path
              .relative(path.dirname(scssIndex), componentScssIndex)
              .replace(/\\/g, "/")
              .replace("/index.scss", "")}";`;
            addImport(scssIndex, scssImport);
          } else {
            const scssImport = `@import "${path
              .relative(
                path.dirname(scssIndex),
                path.join(subDir, dir, "index")
              )
              .replace(/\\/g, "/")
              .replace("/index.scss", "")}";`;
            removeImport(scssIndex, scssImport);
          }
        }
      });

      // Добавление и удаление импортов поддиректорий в файлы index родительской директории
      const parentDir = path.dirname(subDir);
      if (parentDir !== path.resolve(rootDir)) {
        const parentPugIndex = path.join(parentDir, "index.pug");
        const parentScssIndex = path.join(parentDir, "index.scss");

        const pugImport = `include ${path
          .relative(path.dirname(parentPugIndex), pugIndex)
          .replace(/\\/g, "/")
          .replace("/index.pug", "/index")}`;
        addImport(parentPugIndex, pugImport);

        if (scssIndex) {
          const scssImport = `@import "${path
            .relative(path.dirname(parentScssIndex), scssIndex)
            .replace(/\\/g, "/")
            .replace("/index.scss", "")}";`;
          addImport(parentScssIndex, scssImport);
        }
      }
    });
  });

  console.log(chalk.green("Imports have been updated."));
}

// Запуск функции для добавления и удаления импортов
updateImports();
