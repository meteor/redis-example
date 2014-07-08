Deps.autorun(function () {
  var user = Session.get('username');
  if (! user) return;
  Meteor.subscribe('friends', user);
  Meteor.subscribe('yos-from-me', user);
  Meteor.subscribe('yos-for-me', user);
});

