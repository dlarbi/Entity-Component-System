define(function () {
  return {
    mouseInputOn: function() {
      window.userClickX = 0;
      window.userClickY = 0;
      function updateMousePosition(evt) {
        window.userClickX = evt.clientX;
        window.userClickY = evt.clientY;
      }

      window.addEventListener('mousemove', function mouseMove (evt) {
        updateMousePosition(evt);
      }, false);
    }
  };
});
