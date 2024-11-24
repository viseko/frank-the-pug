import { deleteAsync } from "del";
import zipPlugin from "gulp-zip";
import plumber from "gulp-plumber"; // Обработка ошибок
import notify from "gulp-notify"; // Сообщения (подсказки)

export const zip = async () => {
	await deleteAsync(`./${app.path.rootFolder}.zip`);
	
	return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
		.pipe(plumber(
			notify.onError({
				title: "ZIP",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(zipPlugin(`${app.path.rootFolder}.zip`))
		.pipe(app.gulp.dest('./'));
}