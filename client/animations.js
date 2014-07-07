Template.yodors.rendered = function () {
  $('.debug')[0]._uihooks = {
    insertElement: function (node, next) {
      $('.debug li').addClass('shift-down');
      $(node).addClass('pop-in').insertBefore(next);
      setTimeout(function () {
        $('.debug li').removeClass('shift-down');
        $(node).removeClass('pop-in');
      }, 230);
    }
  };
};

