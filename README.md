<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Backend
Тестовое задание от 2x.06.2025.
Бэкенд: [Nest](https://github.com/nestjs/nest) .

ORM взаимодействия с бд: [typeorm](https://docs.nestjs.com/techniques/database#typeorm-integration).


## Необходимые условия:
Версия Node: 24.0.0 <br> База данных: MySQL-8.4 - подготовленная к взаимодействию

## Порядок запуска:

1. Настроить базу данных в [app.module.ts](./src/app.module.ts): указать username, password, database.
2. Выполнить последовательно команды указанные ниже:

```bash
# Установка зависимостей: 
$ npm install
```

```bash
# Сборка
$ npm run build
```
3. Положить папку [client](client) в папку [dist](dist).
4. Убедиться в том, что база данных запущена.
* Для тестирования на windows использовалcя [OpenServer](https://ospanel.io/).
5. Запустить скрипт приложения в терминале в папке [dist](dist):
```bash 
# Запуск приложения
$ node main.js
```
6. Приложение будет доступно по адресу http://localhost:3000/
* Документация по использованию приложения находится в репозитории [frontend](https://github.com/Septant/cyberdine/blob/master/README.md).


## Запуск в режиме разработки
* База данных должна быть запущена.
```bash
# Запуск сервера в режиме разработки:
$ npm run start
```

### Запуск приложения на примере на Windows 10
* Установить [OpenServer](https://ospanel.io/).
* [Документация приложения] (https://github.com/OSPanel/OpenServerPanel/wiki/%D0%94%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F)  
* В трее кликнуть по иконке OpenServer, перейти в раздел "Модули". Выбрать MySQL-8.4 -> запустить.
* Выполнить пункты раздела `Порядок запуска`.

### Linux 
* ```sudo apt install mysql-server mysql-client```

## Лицензирование

Nest распространяется по лицензии [MIT](LICENSE).
