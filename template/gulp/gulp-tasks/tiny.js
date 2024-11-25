import tinyPNG from "gulp-tinypng-compress";
import config from "../config.js";

export const tiny = () => {
	return app.gulp.src(app.path.raw.img)
		.pipe(tinyPNG({
			key: config.keys.tinyPNG,
			sigFile: 'images/.tinypng-sigs',
			log: true
		}))
		.pipe(app.gulp.dest(`${app.path.prepare.img}`));
}