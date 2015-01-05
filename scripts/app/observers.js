define(function () {
  var APP;

  return {
    init : function(APP) {
      this.APP = APP;
    },

    impactListener : function() {

      function playerImpact(evt, collidedWithEntity) {
        console.log('Player Entity: ' + ECS.Entities.Player.id, 'Collided with Entity: ' + collidedWithEntity.id);

        //This logic doesnt seem right here, but for now we only have coins and baddies.
        if(typeof collidedWithEntity.components.Coin != "undefined") {
          ECS.Entities.Player.components.Health.value+=collidedWithEntity.components.Coin.value;
          //$('[data-entity="'+collidedWithEntity.id+'"]').remove();
        } else {
          ECS.Entities.Player.components.Health.value-=1;

        }

      }

      $(window).on('playerCollision', playerImpact);
    },

    attackListener : function() {
      function attackPlayer(evt, attackingEntity) {

        //Right now this ECS.Entity is one namespaced to the attacking entity.  Looks horrid.  Should we pass a more global reference to ECS in from main.js?  Probably. Idk.  Will think.
        var bullet = new attackingEntity.components.Attacker.ECS.Entity();
        bullet.addComponent(new attackingEntity.components.Attacker.ECS.Components.Position(attackingEntity.components.Position.x, attackingEntity.components.Position.y, 1));
        bullet.addComponent(new attackingEntity.components.Attacker.ECS.Components.CSSModel(attackingEntity.components.Attacker.Models.cssCube()));
        bullet.addComponent(new attackingEntity.components.Attacker.ECS.Components.Collides());
        bullet.addComponent(new attackingEntity.components.Attacker.ECS.Components.RandomWalker(100)); //RandomWalker initialized with stepSize;
        bullet.addComponent(new attackingEntity.components.Attacker.ECS.Components.Bullet());
        window.entityArray.push(bullet)
        attackingEntity.components.Attacker.ECS.Systems.renderCSSModel(entityArray);

      }
      var throttledAttack = _.throttle(attackPlayer, 3000)
      $(window).on('attack', throttledAttack);
    }

  }
});
