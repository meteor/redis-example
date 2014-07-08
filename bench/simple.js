var users = [];

function getFriends() {
    var users = document.querySelectorAll('ul.users li.user-panel div.user strong');
    return Array.prototype.map.call(users, function(e) {
        return e.innerText;
    });
}

function getYos() {
    var users = document.querySelectorAll('ul.debug li');
    return Array.prototype.map.call(users, function(e) {
        return e.innerText;
    });
}

var me = casper.cli.get("me");
var friends = (casper.cli.get("friends") || '').split(',');
var yoTo = undefined;

if (friends) {
  yoTo = friends[Math.floor(Math.random()*friends.length)];
}

casper.test.begin("Yodeling", function (test) {

  casper.on('remote.message', function(msg) {
      this.echo('remote message caught: ' + msg);
  });

  casper.on("page.error", function(msg, trace) {
      this.echo("Page Error: " + msg, "ERROR");
  });

  casper.start('http://meteyo.meteor.com/', function() {
      test.assertEquals(this.getTitle(), "MeteYO", "Correct title");
  });

  casper.waitForSelector('form#register-form');

  test.assert(me && me.length > 0, "me is provided on command line");

  // Sign in
  casper.then(function () {
      this.fillSelectors('form#register-form', { 'input#register-username': me }, true);
  });

  // Add friends
  casper.waitForSelector('form#friend-form');
  if (friends) {
    casper.then(function() {
      for (var i = 0; i < friends.length; i++) {
        var friend = friends[i];
        if (!friend) continue;
        this.fillSelectors('form#friend-form', { 'input#friend-username': friend }, true);
      }
    });
  }

  // Check that friends are added
  casper.then(function() {
    this.wait(2000);
  });

  //casper.waitForSelector('ul.users div.user');

  casper.then(function() {
    var actual = this.evaluate(getFriends);

    this.echo(actual.length + ' friends found:');
    this.echo(' - ' + actual.join('\n - '));

    if (friends) {
      for (var i = 0; i < friends.length; i++) {
        var friend = friends[i];
        if (!friend) continue;
        test.assertTrue(actual.indexOf(friend.toUpperCase()) != -1, "Found friend: " + friend);
      }
    }
  });

  // Send a yo to a random friend
  if (yoTo) {
    casper.then(function() {
      this.clickLabel(yoTo);
    });
  }

  // Log in as random friend, check we got the yo
  if (yoTo) {
    casper.thenOpen('http://meteyo.meteor.com/');
    casper.waitForSelector('form#register-form');

    casper.then(function () {
      this.fillSelectors('form#register-form', { 'input#register-username': yoTo }, true);
      this.waitForSelector('ul.debug li');
    });

    casper.then(function () {
      //this.debugHTML();

      var yos = this.evaluate(getYos);

      this.echo(yos.length + ' yos found:');
      this.echo(' - ' + yos.join('\n - '));

      test.assertTrue(yos.indexOf('YO from ' + me) != -1, "Found yo");
    });
  };

  // Actually start the test!
  casper.run(function() {
      test.done();
  });
});
