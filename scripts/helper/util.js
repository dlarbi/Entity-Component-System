define(function () {
  return {
    mouseInputOn: function() {
      window.userInputX = 0;
      window.userInputY = 0;
      function updateMousePosition(evt) {
        window.userInputX = evt.clientX;
        window.userInputY = evt.clientY;
      }

      window.addEventListener('mousemove', function mouseMove (evt) {
        updateMousePosition(evt);
      }, false);
    },

    keyboardInputOn: function() {
      window.userInputX = 0;
      window.userInputY = 0;
      window.userInputZ = 1;
      document.onkeydown = checkKey;

      function checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '38') {
          // up arrow
          window.userInputY-=20;
        }
        else if (e.keyCode == '40') {
          window.userInputY+=20;
        }
        else if (e.keyCode == '37') {
          // left arrow
          window.userInputX-=20;
        }
        else if (e.keyCode == '39') {
          // right arrow
          window.userInputX+=20;
        }

      }
    }
  };
});
