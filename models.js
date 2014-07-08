/* Friends
 * friends::<user-id>::<friend-id> - <friend-id>
 * TODO: change to a set of friends?
 *
 * Messages
 * yo::<reversed ts>::<to-user-id>::<from-user-id> - <message>
 *
 * Users
 * user::<user-id> - <user-id>
 */
Redis = new Meteor.RedisCollection('redis');

Redis.allow({
  exec: function (userId, command, args) {
    if (! _.contains(['set', 'setex', 'del'], command))
      return false;
    var keyDecomposed = args[0].split('::');
    if (command !== 'del' && keyDecomposed.length === 4 && keyDecomposed[0] === 'yo')
      return true;
    if (keyDecomposed.length === 3 && keyDecomposed[0] === 'friends')
      return true;
    if (command !== 'del' && keyDecomposed.length === 2 && keyDecomposed[0] === 'user')
      return true;
    return false;
  }
});

if (Meteor.isServer) {
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
} else {
  Deps.autorun(function () {
    var user = Session.get('username');
    if (! user) return;
    Meteor.subscribe('friends', user);
    Meteor.subscribe('yos-from-me', user);
    Meteor.subscribe('yos-for-me', user);
  });
}

