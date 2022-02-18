const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);

const { changeName, codeChange, disconnect,
    sendMessage, streamRequest, join, stopStream } = require("./socket-messages");
const { getRoomData } = require("./helpers");

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

httpServer.listen(process.env.PORT || 5000);

app.get("/", (req, res) => {
    res.send({ response: "Server is running..." }).status(200);
});

io.on("connection", (socket) => {
    socket.emit("connected", {id: socket.id});

    socket.on("codeChange", (commonCode) => {
        codeChange({socket, io}, commonCode);
    });

    socket.on("changeName", (newName, callback) => {
        changeName({socket, io}, newName, callback);
    });

    socket.on("disconnect", () => {
        disconnect({socket, io});
    });

    socket.on("roomData", (room, callback) => {
        callback(getRoomData(room));
    })

    /*
    *  При отправке сообщения всем участникам комнаты отправляется объект
    *  {user, text, time}
    *  user - имя отправителя
    *  text - текст сообщения
    *  time - время отправки сообщения
    */
    socket.on("sendMessage", (message, callback) => {
        sendMessage({ socket, io }, message, callback);
    });


    /*
    * Запрос на стрим
    * Отправляется streamAccept со стримером
    */
    socket.on("streamRequest", () => {
        streamRequest( { socket, io } );
    });

    socket.on("streamStop", stopStream.bind(this, { socket, io }));

    socket.on("join", (user, callback) => {
        join({ socket, io}, user, callback)
    });

});
