var rooms = [];
var handleFlag = false;

var app = {
  username: '',
  roomname: 'Main',
  friends: {},
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  this.fetch();
  rooms = {};

  app.username = window.location.search.substr(10);

  $('.clear').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    app.clearMessages();
    return false;
  });
  
  $('#roomSelect').change(function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    var temp;
    if ($('#roomSelect').val() === 'Main') {
      app.roomname = 'Main';
    } else {
      app.roomname = $('#roomSelect').val();
    }
    if (app.roomname) {
      $('.chat').hide();
      for (var i = 0; i < $('.chat').length; i++) {
        temp = $($('.chat')[i]);
        if (temp.data('room') === app.roomname) {
          temp.show();
        }
      }
    } else {
      $('.chat').show();
    }
    return false;
  });

  $('#send').on('submit', app.handleSubmit);

  $('#chats').on('click', '.username', function(e) {
    e.preventDefault;
    if (!app.friends[$(e.target).text()]) {
      app.addFriend($(e.target));  
    }
  });
};

app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', message);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  var data = $.ajax({
    url: this.server,
    type: 'GET',
    data: {order: '-createdAt'}, // JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      // console.log('chatterbox: Message received', data);
      app.clearMessages();
      app.populateChat(data.results);
      app.populateRooms(data.results);
    },
    error: function (data) {
      console.error('chatterbox: Failed to receive message', data);
    }
  });

  app.clearMessages = function() {
    $('#chats').children().remove();
    this.messageLog = [];
  };

  app.addMessage = function(chatObj) {
    app.send(chatObj);
  };

  app.createMessage = function(chatObj) {
    var tempMsg = $('<div class="chat"></div>');
    tempMsg.text(chatObj.text);
    var tempUsr = $('<div class="username"></div>');
    tempUsr.text(chatObj.username);
    if (app.friends[chatObj.username]) {
      tempUsr.addClass('friend');
    }
    tempMsg.prepend(tempUsr);
    return tempMsg;
  };

  app.populateChat = function(chatList) {
    _.each(chatList, app.showMessage);
    app.messageLog = data;
  };

  app.showMessage = function(chatObj) {
    // Takes in message
    // gives message data value of objectId
    var $newMsg = app.createMessage(chatObj);
    $newMsg.data('room', chatObj.roomname);
    $newMsg.hide();
    // appends it to the page
    $('#chats').append($newMsg);
    if (app.roomname === 'Main' || $newMsg.data('room') === app.roomname) {
      $newMsg.show();
    }
  };

  app.refresh = function() {
    app.fetch();
  };
  
  app.addRoom = function(roomName) {
    $('#roomSelect').append($('<option value="' + roomName + '"></option>').text(roomName));
    rooms[roomName] = true;
  };

  app.populateRooms = function(chatList) {
    $('#roomSelect').html('');
    rooms = {Main: true };
    _.each(chatList, function(chatObj) {
      if (chatObj.roomname !== undefined && chatObj.roomname !== '') {
        rooms[chatObj.roomname] = true;
      }
    });
    _.each(rooms, function(val, roomName) {
      app.addRoom(roomName);
    });
  };

  app.handleSubmit = function(e) {
    e.preventDefault();
    e.stopPropagation();
    handleFlag = true;

    var message = {};
    message.username = app.username;
    message.text = $('#message').val();
    message.roomname = app.roomname || 'Main';
    app.addMessage(message);
    $('.username').val('');
    $('#message').val('');
  };

  app.addFriend = function(e) {
    e.addClass('friend');
    app.friends[e.text()] = true;
  };
};

$('document').ready(function() {

  app.init();

  setInterval(app.refresh, 5000);
});





