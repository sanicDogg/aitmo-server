const { getUser, getStreamer, removeUser, setStreamer, addUser, getUsersInTheRoom} = require('./users');
const { getRoomData, logText } = require('./helpers');

let collaborativeCode = [];

const changeName = ({ socket, io }, newName, callback) => {
    const user = getUser(socket.id);
    if (!user) return;

    const streamer = getStreamer(user.room);
    if (streamer) {
        if (streamer.id === user.id) {
            callback({error: "You can't change name while streaming"});
            return;
        }
    }

    const oldName = user.name;

    removeUser(socket.id);
    // user.name = newName;
    // addUser(user);
    io.to(user.room).emit("roomData", getRoomData(user.room));
    io.to(user.room).emit("message",
      {user: "admin", text: `${oldName} changes name to ${newName}`, time: Date.now()});
    callback();
    socket.disconnect();
}

const codeChange = ({ socket, io }, commonCode) => {
    const user = getUser(socket.id);
    if (!user) return;

    collaborativeCode[user.room] = commonCode;

    const userRoom = user.room;
    io.to(userRoom).emit("codeChange", commonCode);
}

const disconnect = ({ socket, io }) => {
    let user = getUser(socket.id);
    if (!user) return;

    // Если стример закрыл вкладку, он больше не стример
    const streamer = getStreamer(user.room);
    if (streamer) {
        if (streamer.id === getUser(socket.id).id) {
            stopStream({ socket, io });
        }
    }
    user = removeUser(socket.id);

    if (getUsersInTheRoom(user.room).length === 0) {
        delete collaborativeCode[user.room];
    }

    if (user) {
        io.to(user.room).emit("message",
          {user: "admin", text: `${user.name} has left`, time: Date.now()});

        io.to(user.room).emit("roomData",getRoomData(user.room));

        logText(`User ${user.name} has left from room ${user.room}`);
    }
}

const sendMessage = ({ socket, io }, message, callback) => {
    const user = getUser(socket.id);

    if (user) {
        io.to(user.room).emit("message",
          {user: user.name, text: message, time: Date.now()});
    }

    callback();
}

const stopStream = ({ socket, io }) => {
    // Для остановки стрима отправляется streamClose
    const user = getUser(socket.id);
    if (!user) return;
    setStreamer(user.room);

    io.to(user.room).emit("streamClose");
    io.to(user.room).emit("message",
      { user: "admin", text: `${user.name} has stopped stream`, time: Date.now()});
}

const streamRequest = ( { socket, io } ) => {
    const user = getUser(socket.id);
    if (!user) return;

    setStreamer(user.room, socket.id);

    io.to(user.room).emit("streamAccept", user);
    io.to(user.room).emit("message",
      { user: "admin", text: `${user.name} is streaming right now!`, time: Date.now()});
}

const join = ({ socket, io }, userData, callback) => {
    const { name, room, peerId } = userData;

    const { error, user } = addUser({ id: socket.id, name, room, peerId });

    if (error) return callback(error);

    socket.join(user.room);
    // Если в комнате есть стример, передаем клиентам streamAccept
    const streamer = getStreamer(room);
    if (streamer) {
        io.to(user.room).emit("streamAccept", streamer);
    }

    logText(`User ${user.name} has joined to the room ${room}`);

    io.to(user.room).emit("message",
      { user: "admin", text: `${user.name} has joined to the room!`, time: Date.now()});

    io.to(user.room).emit("roomData",getRoomData(user.room));

    io.to(user.room).emit("codeChange", collaborativeCode[user.room]);

    callback();
}

module.exports = { changeName, codeChange, disconnect, sendMessage, stopStream, streamRequest, join }
