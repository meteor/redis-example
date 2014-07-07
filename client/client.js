Session.setDefault('username', null); // start by no name

Template.friendsList.friends = function() {
  var user = Session.get('username');
  return user ? Redis.matching('friends::' + user + '::*') : [];
};

Template.friend.events({
  'click li': function () {
    var user = Session.get('username');
    if (! user) return;

    var ts = (10000000000000 - new Date);
    var toUser = this.value;
    var ttl = 10; // 10 seconds
    Redis.setex('yo::' + ts + '::' + toUser + '::' + user, ttl, 'yo');
  }
});

Template.addFriend.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var usernameField = template.find('#friend-username')
    var username = usernameField.value.trim().toLowerCase();
    var newFriend = Redis.get('user::' + username);

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
  var user = Session.get('username');
  if (! user) return;

  if (! Redis.get('friends::' + user + '::' + newUserId)) {
    Redis.set('friends::' + user + '::' + newUserId, newUserId);
  }
}

Template.friend.count = function () {
  var user = Session.get('username');
  if (! user) return;

  var friend = this.value;
  return Redis.matching('yo::*::' + friend + '::' + user).count();
};

Template.friend.username = function () {
  var id = this._id;
  return id ? id.split('::')[2] : '';
};

Template.yodors.yodors = function () {
  var user = Session.get('username');
  if (! user) return;

  return Redis.matching('yo::*::' + user + '::*');
};

Template.yodors.username = function () {
  var id = this._id;
  return id ? id.split('::')[3] : '';
};

Template.registerForm.events({
  'submit #register-form': function(event, template) {
    event.preventDefault();
    var username = template.find('#register-username').value.trim().toLowerCase();

    Redis.set('user::' + username, username);
    Session.set('username', username);

    return false;
  }
});

UI.body.loggedIn = function () {
  return Session.get('username') ? true : false;
};

document.addEventListener('touchstart', function(){}, true);

