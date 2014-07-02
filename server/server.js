Yodors = new Meteor.Collection('yodors');

var hodorId;
Meteor.startup(function () {
  if (Meteor.users.find({}).count() === 0) {
    hodorId = Accounts.createUser({username: 'hodor', password: Meteor.uuid()});
  }
});

Accounts.onCreateUser(function(options, user) {
  user.profile = {friends: [hodorId]};
  return user;
});

Meteor.users.allow({
  update: function(userId, user, fields, modifier) {
    if (userId === user._id) {
      if (fields.length !== 1 || fields[0] !== 'profile') {
        return false;
      }
      return true;
    } else {
      if (_.has(modifier, '$push') && _.has(modifier['$push'], 'profile.friends') && modifier['$push']['profile.friends'] === userId) {
        return true;
      }
      return false;
    }
  }
});

