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

