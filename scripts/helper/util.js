define(function () {
  return {
    mouseInputOn: function() {
      window.userInputX = 0;
      window.userInputY = 0;
      window.userInputLClick = 0;


      function updateMousePosition(evt) {
        window.userInputX = evt.clientX;
        window.userInputY = evt.clientY;
      }
      window.addEventListener('click', function(e) {
        window.userInputLClick = 1;
        window.clickX = e.offsetX;
        window.clickY = e.offsetY;
      }, false);
      window.addEventListener('mousemove', function mouseMove (evt) {
      //  updateMousePosition(evt);
      }, false);
    },

    FindElementDocumentPosition: function(element) {
      return element.position();
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
          window.userInputY = -30;
        }
        else if (e.keyCode == '40') {
          window.userInputY = 30;
        }
        else if (e.keyCode == '37') {
          // left arrow
          window.userInputX = -30;
        }
        else if (e.keyCode == '39') {
          // right arrow
          window.userInputX = 30;
        }

      }
    }
  };


});
