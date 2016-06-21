var rooms = [];
var currRoom;
var friends = [];

// YOUR CODE HERE:
var app = {
  message: {
    username: 'Zohandrew',
    text: 'Testing',
    roomname: ''
    // createdAt: ,
    // objectId: ,
    // updatedAt:
  },
  server: 'https://api.parse.com/1/classes/messages',
  messageLog: []
};

app.init = function() {
  this.fetch();
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
    data: data, // JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received', data);
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
    app.showMessage(chatObj);
  };

  app.createMessage = function(chatObj) {
    var tempMsg = $('<div class="chat"></div>');
    tempMsg.text(chatObj.text);
    var tempUsr = $('<div class="username"></div>');
    tempUsr.text(chatObj.username);
    if (_.indexOf(friends, chatObj.username) > -1) {
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
    if (currRoom === undefined || $newMsg.data('room') === currRoom) {
      $newMsg.show();
    }
  };

  app.refresh = function() {
    app.fetch();
  };
  
  app.addRoom = function(roomName) {
    var tempRoom = $('<option value="' + roomName + '"></option>');
    tempRoom.text(roomName);
    $('#roomSelect').append(tempRoom);
  };

  app.populateRooms = function(chatList) {
    var roomFlag = false;
    rooms = ['Main'];
    _.each(chatList, function(chatObj) {
      if (chatObj.roomname !== undefined && chatObj.roomname !== '') {
        rooms.push(chatObj.roomname);
      }
    });
    rooms = _.uniq(rooms);
    rooms = _.sortBy(rooms, function(room) { return room; });
    _.each(rooms, function(roomName) {
      _.each($('#roomSelect').children(), function(option) {
        if ($(option).val() === roomName) {
          roomFlag = true;
        }
      });
      if (!roomFlag) {
        app.addRoom(roomName);
      }
      roomFlag = false;
    });
  };

  app.handleSubmit = function(e) {
    app.message.username = window.location.search.slice(10, window.location.search.length); // $('.username').val() ||
    app.message.text = $('.message').val();
    app.addMessage(app.message);
    $('.username').val('');
    $('.message').val('');
  };

  app.addFriend = function(e) {
    // console.log(e);
    e.addClass('friend');
    friends.push(e.text());
  };

  app.removeFriend = function(e, index) {
    e.removeClass('friend');
    friends.splice(index, 1);
  };
};

$('document').ready(function() {

  app.init();

  // Clear Message button handler
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
    app.handleSubmit(e);
    var temp;
    if ($('#roomSelect').val() === 'Main') {
      currRoom = undefined;
    } else {
      currRoom = $('#roomSelect').val();
    }
    if (currRoom) {
      $('.chat').hide();
      for (var i = 0; i < $('.chat').length; i++) {
        temp = $($('.chat')[i]);
        if (temp.data('room') === currRoom) {
          temp.show();
        }
      }
    } else {
      $('.chat').show();
    }
    app.message.roomname = currRoom;
    return false;
  });

  $('.submit').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    app.handleSubmit(e);
    return false;
  });

  $('#chats').on('click', '.username', function(e) {
    e.preventDefault;
    var friendIndex = _.indexOf(friends, $(e.target).text());
    if (friendIndex === -1) {
      app.addFriend($(e.target));  
    } else {
      app.removeFriend($(e.target), friendIndex);
    }
    
  });

  setInterval(app.refresh, 5000);
});





