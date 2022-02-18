const {getUsersInTheRoom} = require('./users');

module.exports = {
  getRoomData: function (room) {
    return {room: room, users: getUsersInTheRoom(room)};
  },

  logText: function (text) {
    console.log(new Date() + " " + text);
  }
};
