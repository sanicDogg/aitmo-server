# aitmo server
Приложение обслуживает пользователей aitmo client

## Установка
- Установить зависимости `npm install`
- Запустить сначала сервер, затем [клиент](https://github.com/sanicDogg/aitmo-client) `npm start`

### Проверка
Если сервер запущен, то http-запрос на localhost:5000 должен вернуть JSON-объект: 
```json
{ "response": "Server is running..." }
``` 

### Справка
По умолчанию порт сервера 5000, порт клиента 3000

Сервер использует библиотеку Socket.io для управления сообщениями

В файле `app.js` можно настроить заголовки CORS

#### Файлы
`app.js` - входной файл сервера

`users.js` - файл с описанием пользователей

`socket-messages.js` - файл, обрабатывающий сообщения по протоколу WebSocket 

### Клиент
Ссылка на репозиторий с клиентом:

[https://github.com/sanicDogg/aitmo-client](https://github.com/sanicDogg/aitmo-client)
