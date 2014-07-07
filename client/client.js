Session.setDefault('username', null); // start by no name

Template.friendsList.friends = function() {
  var user = Session.get("username");
  return user ? Redis.matching("friends::" + user + "::*") : [];
};

Template.friend.events({
  'click li': function () {
    var user = Session.get("username");
    if (! user) return;

    var ts = (10000000000000 - new Date);
    var toUser = this.value;
    var ttl = 10; // 10 seconds
    Redis.setex("yo::" + ts + "::" + toUser + "::" + user, ttl, "yo");
  }
});

Template.addFriend.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var usernameField = template.find('#friend-username')
    var username = usernameField.value.trim().toLowerCase();
    var newFriend = Redis.get("user::" + username);

    usernameField.value = '';

    if (newFriend) {
      addUserToFriends(newFriend);
    } else {
      // TODO: nice notification
      alert('No such user!');
    }

    return false;
  }
});

function addUserToFriends(newUserId) {
  var user = Session.get("username");
  if (! user) return;

  if (! Redis.get("friends::" + user + "::" + newUserId)) {
    Redis.set("friends::" + user + "::" + newUserId, newUserId);
  }
}

Template.friend.count = function () {
  var user = Session.get("username");
  if (! user) return;

  var friend = this.value;
  return Redis.matching("yo::*::" + friend + "::" + user).count();
};

Template.friend.username = function () {
  var id = this._id;
  return id ? id.split("::")[2] : "";
};

Template.yodors.yodors = function () {
  var user = Session.get("username");
  if (! user) return;

  return Redis.matching("yo::*::" + user + "::*");
};

Template.yodors.username = function () {
  var id = this._id;
  return id ? id.split("::")[3] : "";
};

Template.yodors.rendered = function () {
  $('.debug')[0]._uihooks = {
    insertElement: function (node, next) {
      $('.debug li').addClass('shift-down');
      $(node).addClass('pop-in').insertBefore(next);
      setTimeout(function () {
        $('.debug li').removeClass('shift-down');
        $(node).removeClass('pop-in');
      }, 230);
    }
  };
};

Template.registerForm.events({
  'submit #register-form': function(event, template) {
    event.preventDefault();
    var username = template.find('#register-username').value.trim().toLowerCase();

    Redis.set("user::" + username, username);
    Session.set("username", username);

    return false;
  }
});

UI.body.loggedIn = function () {
  return Session.get("username") ? true : false;
};

document.addEventListener("touchstart", function(){}, true);

Meteor.startup(function () {
  notifyUser("", true);
  var user = Session.get("username");
  if (! user) return;

  var yos = {};
  Redis.matching("yo::*::" + user + "::*").observe({
    added: function (doc) {
      yos[doc._id] = notifyUser("YO from " + doc._id.split("::")[3]);
    },
    removed: function (doc) {
      if (yos[doc._id]) {
        yos[doc._id].close();
        delete yos[doc._id];
      }
    }
  });
});

function notifyUser(notificationText, fake) {
  var options = { icon: "http://i.imgur.com/3PGZObx.png" };
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    return;
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    if (fake) return;
    // If it's okay let's create a notification
    return new Notification(notificationText, options);
  }

  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {

      // Whatever the user answers, we make sure we store the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // If the user is okay, let's create a notification
      if (permission === "granted") {
        if (fake) return;
        return new Notification(notificationText, options);
      }
    });
  }

  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother him any more.
}


