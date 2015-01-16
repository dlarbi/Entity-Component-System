define(function () {
  var APP;

  return {
    initialize : function(APPLICATION) {
      APP = APPLICATION;
    },

    collision : function() {
      $(window).on('playerCollision', APP.Systems.playerImpact);
      $(window).on('collision', APP.Systems.entityImpact);
    },

    attack : function() {
      var throttledAttack = _.throttle(APP.Systems.attack, 3000, {trailing:false});
      $(window).on('attack', throttledAttack);
      $(window).on('playerAttack', APP.Systems.playerAttack);
    }

  }
});
