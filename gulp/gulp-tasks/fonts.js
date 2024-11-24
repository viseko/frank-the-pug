/* global app */
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
import { deleteAsync } from "del";
import plumber from "gulp-plumber";
import notify from "gulp-notify"; // Сообщения (подсказки)

export const otfToTtf = () => {
	return app.gulp.src(`${app.path.raw.fonts}/*.otf`, {})
	.pipe(plumber(
		notify.onError({
			title: "FONTS",
			message: "Error: <%= error.message %>"
		}))
	)
	.pipe(fonter({
		formats: ['ttf']
	}))
	.pipe(app.gulp.dest(app.path.raw.fonts));
}

export const ttfToWoff = () => {
	return app.gulp.src(`${app.path.raw.fonts}/*.ttf`, {})
		.pipe(plumber(
			notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(fonter({
			formats: ['woff']
		}))
		.pipe(app.gulp.dest(app.path.prepare.fonts))
		.pipe(app.gulp.src(`${app.path.raw.fonts}/*.ttf`))
		.pipe(ttf2woff2())
		.pipe(app.gulp.dest(app.path.prepare.fonts));
}

export const clearFonts = async (cb) => {
	await deleteAsync([`${app.path.raw.fonts}*.{otf,ttf}`]);
  cb();
};