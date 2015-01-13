define(function () {
  return {
    cssCube : function() {
      this.modelData = '<div id="cube" class="" data-entity=""><div></div><div></div><div></div><div></div><div></div><div></div><div id="health"></div></div>';
      return this;
    },

    cssCoin : function() {
      this.modelData = '<div id="coin" class="animate" data-entity=""></div>';
      return this;
    },

    cssSorcerer : function() {
      this.modelData = '<div class="sorcerer" data-entity=""></div>';
      return this;
    },

    cssBullet : function() {
      this.modelData = '<div class="bullet"></div>';
      return this;
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
