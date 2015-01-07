define(function () {
  ECS = {};
  ECS.Entities = {};
  ECS.Entities.count = 0;
  //Whenever you want to know which entity the player is.  This comes in handy a lot.
  ECS.Entities.Player = 0;

  return {
    //The references to APP and Models are so we can build entities inside our systems. (Ie creating projectiles in an attack system)
    initialize : function(APPLICATION, Models) {
      ECS.APP = APPLICATION;
      ECS.Models = Models;
    },
    Entity : function() {
      this.id = (+new Date()).toString(16) +
      (Math.random() * 100000000 | 0).toString(16) +
      ECS.Entities.count;

      ECS.Entities.count++;
      this.components = {};

      this.addComponent = function(component) {
        this.components[component.name] = component;
        return this;
      }

      this.removeComponent = function(component) {
        var name = component;
        if(typeof component === 'function'){
          name = component.prototype.name;
        }
        delete this.components[name];
        return this;
      }

      this.print = function print () {
        console.log(JSON.stringify(this, null, 4));
        return this;
      };
    },

    Components : {
      Health : function(value) {
        this.name = 'Health';
        var value = value || 20;
        this.value = value;
        return this;
      },
      TakesDamage : function(multiplier){
        this.name = 'TakesDamage';
        this.multiplier = multiplier;
        return this;
      },
      Position : function(x,y,z) {
        this.name = 'Position';
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      },
      PlayerControlled : function(player) {
        this.name = 'PlayerControlled';
        if(typeof player != "undefined") {
          ECS.Entities.Player = player;
        }
        return this;
      },
      //This model component is mean to handle data of the form
      //[{x, y, z, rgba}, {x, y, z, rgba}, {x, y, z, rgba}, ... ]
      Model : function(modelData) {
        this.name = 'Model';
        this.data = modelData;
        return this;
      },
      CSSModel : function(model) {
        this.name = "CSSModel";
        this.model = model.modelData;
        return this;
      },
      Collides : function() {
        this.name = "Collides";
        return this;
      },
      RandomWalker : function(stepSize) {
        this.name = "RandomWalker";
        this.stepSize = stepSize;
        return this;
      },
      Attacker : function() {
        this.name = "Attacker";
        return this;
      },
      Projectile : function(x, y) {
        this.name = "Projectile";
        var timer = timer || 50;
        this.destination = {x:x, y:y},
        this.timer = timer;
        return this;
      },
      Coin : function() {
        this.name = "Coin";
        var value = value || 5;
        this.value = value;
        return this;
      }
    },

    Systems : {
      render : function(entities) {
        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        var canvasData = ctx.getImageData(0, 0, c.width, c.height);

        ctx.clearRect ( 0 , 0 , c.width, c.height );

        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Position != "undefined") {
            var x = currentEntity.components.Position.x;
            var y = currentEntity.components.Position.y;
            var imageData = ctx.createImageData(1,1);
            var d  = imageData.data;
            d[0]   = 0;
            d[1]   = 1;
            d[2]   = 0;
            d[3]   = 255;
            ctx.putImageData( imageData, x, y );
          }
        }
      },

      renderCSSModel : function(entities) {
        var el;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.CSSModel != "undefined") {
            //dont render the same element if it exists
            if(!$('[data-entity="'+currentEntity.id+'"]').length) {
              var type = currentEntity.components.CSSModel.type;
                el = $(currentEntity.components.CSSModel.model);
                el.attr('data-entity', currentEntity.id);
                $('body').append(el);
            }
          }
        }
      },

      positionCSSModel : function(entities) {
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.CSSModel != "undefined") {
            var x = currentEntity.components.Position.x;
            var y = currentEntity.components.Position.y;
            var z = currentEntity.components.Position.z;

            if($('[data-entity="'+currentEntity.id+'"]').hasClass('animate')) {
              $('[data-entity="'+currentEntity.id+'"]').css({
              left:x,
              top: y
              });
            } else {
              $('[data-entity="'+currentEntity.id+'"]').css({
                '-webkit-transform' : 'translate('+x+'px,'+y+'px)',
                '-moz-transform'    : 'translate('+x+'px,'+y+'px)',
                '-ms-transform'     : 'translate('+x+'px,'+y+'px)',
                '-o-transform'      : 'translate('+x+'px,'+y+'px)',
                'transform'         : 'translate('+x+'px,'+y+'px)'
              });
            }


            /*
            //We could maybe add jumping to our little cube game with this.  An entity's Z changes and it would scale
            $('[data-entity="'+currentEntity.id+'"]').css({
              '-webkit-transform' : 'translate('+x+'px,'+y+'px)',
              '-moz-transform'    : 'translate('+x+'px,'+y+'px)',
              '-ms-transform'     : 'translate('+x+'px,'+y+'px)',
              '-o-transform'      : 'translate('+x+'px,'+y+'px)',
              'transform'         : 'translate('+x+'px,'+y+'px)'
            });
            */
          }
        }
      },

      userInput : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.PlayerControlled != "undefined") {
            currentEntity.components.Position.x = window.userInputX;
            currentEntity.components.Position.y = window.userInputY;
            currentEntity.components.Position.z = window.userInputZ;
          }
        }
      },

      collisionDetection : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Collides != "undefined"){
            //If the player entity and another entity are within 100px of eachother, fire playerCollision event.
            var xDistFromPlayer = Math.abs(currentEntity.components.Position.x - ECS.Entities.Player.components.Position.x);
            var yDistFromPlayer = Math.abs(currentEntity.components.Position.y - ECS.Entities.Player.components.Position.y);
            if(xDistFromPlayer < 100 && yDistFromPlayer < 100) {
              $(window).trigger('playerCollision', [currentEntity]);
            }
          }
        }
      },


      randomWalking : function(entities) {
          //Adds a random X and a random Y value to the position of any entity with the RandomWalker component
          //Doesn't let it walk out of bounds
          var currentEntity;
          for(var i = 0; i < entities.length; i++) {
            currentEntity = entities[i];
            if(typeof currentEntity.components.RandomWalker != "undefined") {
              var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
              var stepSize = currentEntity.components.RandomWalker.stepSize;
              if(currentEntity.components.Position.x + plusOrMinus*stepSize < 1840 && currentEntity.components.Position.x + plusOrMinus*stepSize > 0) {
                currentEntity.components.Position.x+=(plusOrMinus*stepSize);
              }

              plusOrMinus = Math.random() < 0.5 ? -1 : 1;
              if(currentEntity.components.Position.y + plusOrMinus*stepSize < 900 && currentEntity.components.Position.y + plusOrMinus*stepSize > 0) {
                currentEntity.components.Position.y+=(plusOrMinus*stepSize);
              }
            }
          }
      },

      playerImpact: function(evt, collidedWithEntity) {
        console.log('Player Entity: ' + ECS.Entities.Player.id, 'Collided with Entity: ' + collidedWithEntity.id);
        if(typeof collidedWithEntity.components.Coin != "undefined") {
          ECS.Entities.Player.components.Health.value+=collidedWithEntity.components.Coin.value;
          $('[data-entity="'+collidedWithEntity.id+'"]').remove();
          //To destroy an entity, we remove all of its components.  The entities with no components can be cleaned up later.  Must figure this out.
          collidedWithEntity.components = {};
        } else if(typeof collidedWithEntity.components.Projectile != "undefined") {
          $('[data-entity="'+collidedWithEntity.id+'"]').remove();
          ECS.Entities.Player.components.Health.value-=1;
          collidedWithEntity.components = {};
        }
        console.log('Health: ' + ECS.Entities.Player.components.Health.value)
      },

      attack: function(evt, attackingEntity) {
        var projectile = new ECS.APP.Entity();
        projectile.addComponent(new ECS.APP.Components.Position(attackingEntity.components.Position.x + 120, attackingEntity.components.Position.y + 120, 1));
        projectile.addComponent(new ECS.APP.Components.CSSModel(ECS.Models.cssBullet()));
        projectile.addComponent(new ECS.APP.Components.Collides());
        if(attackingEntity.id == ECS.Entities.Player.id) {

          originX = attackingEntity.components.Position.x;
          originY = attackingEntity.components.Position.y;
          destinationX = window.clickX;
          destinationY = window.clickY;

          var difsquaredX = (destinationX - originX)*(destinationX - originX);
          var difsquaredY = (destinationY - originY)*(destinationY - originY);

          var amp = Math.sqrt(difsquaredX + difsquaredY);

          projectile.addComponent(new ECS.APP.Components.Projectile(window.clickX, window.clickY));
          window.clickX = 0;
          window.clickY = 0;
        } else {
          projectile.addComponent(new ECS.APP.Components.Projectile(0, 0));
        }

        window.entityArray.push(projectile)
        ECS.APP.Systems.renderCSSModel(entityArray);
      },

      attackDetection : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Attacker != "undefined") {
            if(typeof currentEntity.components.PlayerControlled != "undefined"){
              if(window.userInputLClick == 1) {
                $(window).trigger('attack', [currentEntity]);
                window.userInputLClick = 0;
              }
            } else {
              $(window).trigger('attack', [currentEntity]);
            }

          }
        }
      },

      projectiles : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Projectile != "undefined") {
            currentEntity.components.Position.x = currentEntity.components.Projectile.destination.x;
            currentEntity.components.Position.y = currentEntity.components.Projectile.destination.y;
            $('[data-entity="'+currentEntity.id+'"]').css('transition', '1s linear all');

            currentEntity.components.Projectile.timer--;

            if(currentEntity.components.Projectile.timer <= 0) {
              $('[data-entity="'+currentEntity.id+'"]').remove();
              currentEntity.components = {};
            }

          }
        }
      }
    },

    getEntitiesCount : function() {
      return ECS.Entities.count;
    }
  };
});
