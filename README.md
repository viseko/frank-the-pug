![[frank.png]]
## Основные концепции
1) Архитектурная методология [Feature Sliced Design](https://feature-sliced.design/ru/), насколько это возможно для html-вёрстки.
2) БЭМ
3) Сборка: Gulp + Webpack
4) Pug/SCSS/JavaScript-вёрстка
5) TinyPNG для оптимизации изображений

## Начало работы
1. Установка и запуск
```bash
npx frank-the-pug project_name
cd project_name
npm start
```

2. Забрать необходимые компоненты из `/plugins` в `/src`
3. Обновить импорты `npm run imports`

## CLI-команды
1. `npm run start` - режим разработки + запуск локального сервера
2. `npm run build` - сборка для продакшена
3. `npm run dev` - сборка в dev-режиме
4. `npm run zip` - production-сборка + упаковка сборки в zip-архив
5. `npm run imports` - автоматическая простановка pug и scss импортов компонентов в `src/widgets` и `srs/shared`
6. `gulp tiny` - минификация изображений
7. `gulp fonts` - генерация woff/woff2 шрифтов из ttf/otf
8. `gulp svgsprite` - генерация SVG-спрайта из иконок
9. `gulp prepare` - одновременное выполнение `gulp tiny`, `gulp fonts` и `gulp svgSprite`
10. `gulp deploy` - деплой всей сборки на FTP (предварительно настройте `gulp/config/ftp.js`)
11. `gulp deploy --preset-name` - избирательная загрузка сборки на FTP (настраивается индивидуально в `gulp/config/ftp.js`)
12. `gulp copy` - копирование содержимого `public` в `build`
13. `gulp scss` - сборка css
14. `gulp pughtml` - сборка html
15. `gulp js` - сборка js

