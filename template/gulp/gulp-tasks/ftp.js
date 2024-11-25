import vinylFTP from 'vinyl-ftp';
import util from 'gulp-util';
import logger from 'node-color-log';
import plumber from "gulp-plumber";
import notify from "gulp-notify"; // Сообщения (подсказки)
import ftpData from "../config/ftp.js";

function getArgument(arr) {
	const argument = arr.filter(str => /^--/.test(str))[0]
	return argument ? argument.replace("--", "") : null;
}

export const ftp = (cb) => {
	// Получаем аргумент из CLI
	const argument = getArgument(process.argv);
	const settings = argument ? ftpData[argument] : ftpData.default;

	// Если аргумент не зарегистрирован в config/ftp.js
	try {
		if (!settings) {
			throw new Error(`Параметра "${argument}" нет в настройках config/ftp.js!`);
		}
	} catch(err) {
		logger.bgColor("red").color("black").log(err.message)
	}

	// Если всё ок, разбираем поля
	const configFtp = {
		host: settings.host,
		user: settings.user,
		password: settings.password,
		parallel: 5,
	};

	const pathes = settings.pathes;

	if (pathes.length) {
		configFtp.log = util.log;
		const ftpConnect = vinylFTP.create(configFtp);

		pathes.forEach(path => {
			const folderName = path.folder;
			const deployRules = path.rules;

			app.gulp.src(deployRules, {})
			.pipe(plumber(
				notify.onError({
					title: "FTP",
					message: "Error: <%= error.message %>"
				}))
			)
			.pipe(ftpConnect.dest(folderName));
		})
	}

	cb();
}