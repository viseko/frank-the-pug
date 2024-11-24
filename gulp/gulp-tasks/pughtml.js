import pug from "gulp-pug";
import replace from "gulp-replace";
import plumber from "gulp-plumber";
import notify from "gulp-notify"; // Сообщения (подсказки)
import browsersync from "browser-sync"; // Локальный сервер

export const pughtml = () => {
	const timestamp = Date.now().toString(32);

	return app.gulp.src(app.path.src.pug)
	.pipe(plumber(
		notify.onError({
			title: "HTML",
			message: "Error: <%= error.message %>"
		})
	))
	.pipe(pug({
		pretty: '\t', // Сжимать файл (false), '\t' табы вместо пробелов
		verbose: true // В терминале какой файл обработан
	}))
	.pipe(replace(/@img\//g, 'assets/img/'))
	// Заменяем конструкции типа data-attr="data-attr" на data-attr (фикс бага Pug для правильной работы fancybox)
	.pipe(replace(/data-.+?="data.+?"/gm, (match) => {
		const attr = match.replace(/=".+?"/g, "");
		const val = match.match(/".+"/g)[0].replace(/"/g, "");
		return (attr === val) ? attr : val
	}))
	// Таймстампы для решения проблемы с кешированием
	.pipe(replace(/assets\/js\/main\.min\.js/g, `assets/js/main.min.js?v=${timestamp}`))
	.pipe(replace(/assets\/css\/main\.min\.css/g, `assets/css/main.min.css?v=${timestamp}`))
	.pipe(app.gulp.dest(app.path.build.pug))
	.pipe(browsersync.stream());
}