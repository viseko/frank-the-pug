import webpack from "webpack-stream";
import uglify from "gulp-uglify";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import browsersync from "browser-sync";
import path from "path";
import { fileURLToPath } from "url";

// Получаем значение __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация Webpack
const createWebpackConfig = (app) => ({
  mode: app.isDev ? "development" : "production",
  output: {
    filename: "main.min.js",
  },
  resolve: {
    extensions: [".js"],
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
  },
});

export const js = () => {
  return app.gulp
    .src(app.path.src.js, { sourcemaps: app.isDev })
    .pipe(
      plumber(
        notify.onError({
          title: "JS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(webpack(createWebpackConfig(app)))
    .pipe(uglify())
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(browsersync.stream());
};
