/*

MESSAGE OBJECT LAYOUT
createdAt
objectId
roomname
text
updatedAt
username

*/

// YOUR CODE HERE:
var app = {
  message: {
    username: 'Zohandrew',
    text: 'Testing',
    roomname: '4chan',
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
      app.populateChat(data.results);
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

  app.addRoom = function(roomName) {
    return $('#roomSelect').append('<option value="' + roomName + '">' + roomName + '</option>');
  };


  app.createMessage = function(chatObj) {
    return $('<div class="chat ' + chatObj.objectId + '"><div class="username">' + chatObj.username + '</div>' + chatObj.text + '</div>');
  };

  app.populateChat = function(chatList) {
    // _.each(chatList, app.showMessage);
    for (var i = chatList.length - 1; i >= 0; i--) {
      app.showMessage(chatList[i]);
    }
    app.messageLog = data;
  };

  app.showMessage = function(chatObj) {
    // Takes in message
    // gives message data value of objectId
    var $newMsg = app.createMessage(chatObj);
    // appends it to the page
    $('#chats').prepend($newMsg);
    // hides it, then slides down for a cool effect
    $newMsg.hide();
    $newMsg.slideDown('slow');
  };

};

$('document').ready(function() {

  app.init();

  // Clear Message button handler
  $('.clear').on('click', function() {
    app.clearMessages();
  });

  $('.post').on('click', function() {
    event.preventDefault();
    app.message.username = $('.username').val();
    app.message.text = $('.message').val();
    app.addMessage(app.message);
    $('.username').val('');
    $('.message').val('');
  });
  setInterval(app.fetch, 5000);
});





