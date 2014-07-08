Meteor.startup(function () {
  notifyUser('', true);
  var user = Session.get('username');
  if (! user) return;

  Redis.matching('yo::*::' + user + '::*').observe({
    added: function (doc) {
      notifyUser('YO from ' + doc._id.split('::')[3]);
    }
  });
});

notifyUser = function (notificationText, fake) {
  var options = { icon: 'http://i.imgur.com/3PGZObx.png' };
  var notification = null;

  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    return;
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === 'granted') {
    if (fake) return;
    // If it's okay let's create a notification
    notification = new Notification(notificationText, options);
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
      if (permission === 'granted') {
        if (fake) return;
        notification = new Notification(notificationText, options);
      }
    });
  }

  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother him any more.

  // Clean up the notification after a short period of time
  // XXX too little?
  notification && setTimeout(function () { notification.close(); }, 5 * 1000);
}

