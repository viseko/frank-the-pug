import browsersync from "browser-sync"; // Локальный сервер

export const server = (done) => {
	browsersync.init({
		server: {
			baseDir: `${app.path.buildFolder}/`
		},
		notify: false,
		port: 3000
	})
}