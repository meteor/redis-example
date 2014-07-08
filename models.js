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

