/* global app */
import svgSprite from "gulp-svg-sprite";
import replace from "gulp-replace"; // Поиск и замена

const config = {
  mode: {
    symbol: {
      sprite: `../sprite.svg`,
      example: false,
    },
  },
};

export const svgsprite = () => {
  return app.gulp
    .src(`${app.path.raw.svgIcons}`)
    .pipe(
      svgSprite(config)
    )
    .pipe(replace(/fill=\".*?\"/g, 'fill="currentColor"'))
    .pipe(replace(/stroke=\".*?\"/g, 'stroke="currentColor"'))
    .pipe(app.gulp.dest(app.path.prepare.img));
};