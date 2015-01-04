define(function () {
  return {
    cssCube : function() {
      return 'cube';
    },

    singlePixel : function(x,y,z) {
      var pixels = [
        {
          x:x,
          y:y,
          z:z,
          color:[0, 1, 0, 255]
        }
      ];
      return pixels;
    },

    getPlayerModel : function() {
      var pixels = [];
      for (var x = -150; x < 150; x+=5) {
        for (var y = -150; y < 150; y+=5) {
          pixels.push({
            x: x,
            y: y,
            z: 1,
            color: [0,1,0,255]
          })
        }
      }
      return pixels;
    }
  };
});
