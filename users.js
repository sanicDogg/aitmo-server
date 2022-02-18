const users = [];
const streamers = [];

/**
 * Добавляет пользователя в массив и возвращает его
 * или объект с ошибкой
 *
 * @param id Идентификатор пользователя
 * @param name Имя пользователя
 * @param room Комната
 * @param peerId Идентификатор пира
 * @return {{user: {name, id, room}, error: {}}} Пользователь
 */

const addUser = ({ id, name, room, peerId }) => {
    name = name.trim();

    const existingUser = users.find((user) => user.room === room && user.name === name);

    if (existingUser) return { error: "Username is taken.\nChange your name by clicking on it and refresh the page" }
    if (!name) return { error: "Username required" }
    if (!room) return { error: "Room required" }

    const user = { id, name, room, peerId };
    users.push(user);

    return { user };
}

/**
 * Удаляет пользователя из массива и возвращает его
 *
 * @param id Идентификатор пользователя
 * @return {{name, id, room}} Пользователь
 */

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
}

/**
 * Добавляет нового стримера в массив и возвращает его
 * Если не указан id, удаляет текущего стримера
 *
 * @param room Комната пользователя
 * @param id Идентификатор пользователя
 * @return {{name, id, room}} Пользователь
 */
const setStreamer = (room, id) => {
    let users = getUsersInTheRoom(room);
    let existing = streamers.findIndex((streamer) => streamer.room === room);
    if (existing !== -1) {
        streamers.splice(existing, 1);
    }
    if (!id) return;
    let newStreamer = users.find((user) => user.id === id);
    streamers.push(newStreamer);

    return newStreamer;
}

/**
 * Возвращает стримера в комнате
 *
 * @param room Комната пользователя
 * @return {{name, id, room}} Пользователь
 */
const getStreamer = (room) => {
    const streamer = streamers.find((streamer) => streamer.room === room);
    if (!streamer) return false;
    return streamer;
}

/**
 * Возвращает пользователя по id
 *
 * @param id Идентификатор пользователя
 * @return {{name, id, room}} Пользователь
 */

const getUser = (id) => users.find((user) => user.id === id);

/**
 * Возвращает всех пользователей в комнате
 *
 * @param room Комната
 * @return {*[]} Массив пользователей
 */

const getUsersInTheRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInTheRoom, getStreamer, setStreamer }
