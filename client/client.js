/**
* Templates
*/
Template.messages.messages = function () {
  return Messages.matching('message:*').fetch();
};

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      if (Meteor.user())
        var name = Meteor.user().profile.name;
      else
        var name = 'Anonymous';

      var message = document.getElementById('message');

      if (message.value != '') {
        var id = 'message:' + Random.id();
        Messages.set(id, name);
        document.getElementById('message').value = '';
        message.value = '';
      }
    }
  }
}