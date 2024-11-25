import gulp from "gulp";
import path from "./gulp/config/path.js";
import {
  copy,
  otfToTtf,
  ttfToWoff,
  clearFonts,
  ftp,
  svgsprite,
  tiny,
  js,
  pughtml,
  reset,
  scss,
  server,
  zip,
} from "./gulp/gulp-tasks/index.js";

function isBuild() {
  return process.argv.includes("--build") || process.argv.includes("build");
}

// Передаем значения в глобальную переменную
global.app = {
  isBuild: isBuild(),
  isDev: !isBuild(),
  path: path,
  gulp: gulp,
};

// Наблюдатель
function watcher() {
  gulp.watch(path.watch.public, copy);
  gulp.watch(path.watch.pug, pughtml);
  gulp.watch(path.watch.sass, scss);
  gulp.watch(path.watch.js, js);
}

const mainTasks = gulp.series(reset, gulp.parallel(copy, pughtml, scss, js));
const dev = gulp.series(mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(mainTasks);
const pkzip = gulp.series(mainTasks, zip);
const deploy = gulp.series(ftp);
const fonts = gulp.series(otfToTtf, ttfToWoff, clearFonts);
const prepare = gulp.parallel(fonts, tiny, svgsprite);

export {
  dev,
  build,
  pkzip,
  deploy,
  prepare,
  fonts,
  copy,
  scss,
  pughtml,
  js,
  tiny,
  svgsprite,
};

gulp.task("default", dev);