import dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import cleanCss from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import sourcemaps from "gulp-sourcemaps"
import replace from "gulp-replace";
import plumber from "gulp-plumber";
import notify from "gulp-notify"; // Сообщения (подсказки)
import browsersync from "browser-sync"; // Локальный сервер
const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src(app.path.src.sass, { sourcemaps: app.isDev })
	.pipe(plumber(
		notify.onError({
			title: "SASS",
			message: "Error: <%= error.message %>"
		})
	))
	.pipe(replace(/@img\//g, '../assets/img/'))
	// .pipe(sourcemaps.init())
	.pipe(sass({
		outputStyle: 'expanded'
	}))
	.pipe(groupCssMediaQueries())
	.pipe(autoprefixer({
		grid: true,
		overrideBrowserlist: ["last 3 versions"],
		cascade: true
	}))
	// Расскомментировать если нужен не сжатый дубль файла стилей
	//.pipe(app.gulp.dest(app.path.build.css))
	.pipe(cleanCss())
	.pipe(rename({
		basename: "main",
		extname: ".min.css"
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(app.gulp.dest(app.path.build.css))
	.pipe(browsersync.stream());
}