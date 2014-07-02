/**
* Templates
*/
Template.messages.messages = function () {
  return Messages.matching('message:*').fetch();
};

Template.input.events = {
  'click button#sendyo' : function (event) {
    var name = document.getElementById('username').value;
    if (!name) {
      name = 'Anonymous Coward';
    }
    var id = 'message:' + (10000000000000 - new Date().getTime()) + ':' + Random.id();
    var ttl = 10;
    Messages.setex(id, ttl, name);
  }
}