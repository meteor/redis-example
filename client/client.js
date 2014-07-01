/**
* Templates
*/
Template.messages.messages = function () {
  return Messages.matching('message:*').fetch();
};

Template.input.events = {
  'click button#sendyo' : function (event) {
    if (Meteor.user())
      var name = Meteor.user().profile.name;
    else
      var name = 'Anonymous';

    var id = 'message:' + new Date().getTime() + ':' + Random.id();
    var ttl = 10;
    Messages.setex(id, ttl, name);
  }
}