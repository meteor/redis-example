Meteor.publish('friends', function (user) {
  if (! user || user.indexOf('::') !== -1) return [];
  return Redis.matching('friends::' + user + '::*');
});
Meteor.publish('yos-for-me', function (user) {
  if (! user || user.indexOf('::') !== -1) return [];
  return Redis.matching('yo::*::' + user + '::*');
});
Meteor.publish('yos-from-me', function (user) {
  if (! user || user.indexOf('::') !== -1) return [];
  return Redis.matching('yo::*::*::' + user);
});

