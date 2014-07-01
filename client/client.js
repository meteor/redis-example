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

    var id = 'message:' + Random.id();
    Messages.set(id, name);
  }
}