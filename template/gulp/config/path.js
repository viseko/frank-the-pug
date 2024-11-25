// Получаем имя папки проекта
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./build`;
const publicFolder = `./public`;
const srcFolder = `./src`;
const rawFolder = `./raw`;

const path = {
	build: {
		js: `${buildFolder}/assets/js/`,
		css: `${buildFolder}/assets/css/`,
		pug: `${buildFolder}/`,
		public: `${buildFolder}/`,
	},
	src: {
		js: `${srcFolder}/index.js`,
		sass: `${srcFolder}/index.scss`,
		pug: `${srcFolder}/pages/*.pug`,
		public: `${publicFolder}/**/*.*`,
	},
	prepare: {
		fonts: `${publicFolder}/assets/fonts/`,
		img: `${publicFolder}/assets/img/`,
	},
	raw: {
		fonts: `${rawFolder}/fonts/`,
		img: `${rawFolder}/img/**/*.{jpg,jpeg,png}`,
		svgIcons: `${rawFolder}/svg-icons/*.svg`
	},
	watch: {
		js: `${srcFolder}/**/*.js`,
		sass: `${srcFolder}/**/*.scss`,
		pug: `${srcFolder}/**/*.pug`,
		public: `${publicFolder}/**/*.*`,
	}, 
	clean: buildFolder,
	buildFolder,
	srcFolder,
	rootFolder,
	rawFolder,
	publicFolder
}

export default path;