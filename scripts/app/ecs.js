define(function () {
  ECS = {};
  ECS.Entities = {};
  ECS.Entities.count = 0;
  //Whenever you want to know which entity the player is.  This comes in handy a lot.
  ECS.Entities.Player = 0;

  return {
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
      CSSModel : function(type) {
        this.name = "CSSModel";
        this.type = type;
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
      Attacker : function(ECS, Models) {
        this.name = "Attacker";
        this.ECS = ECS;
        this.Models = Models;
        return this;
      },
      Bullet : function() {
        this.name = "Bullet";
        var timer = timer || 50;
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
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.CSSModel != "undefined") {
            //dont render the same element if it exists
            if(!$('[data-entity="'+currentEntity.id+'"]').length) {
              var type = currentEntity.components.CSSModel.type;
              if(type == 'coin') {
                $('body').append('<div id="'+currentEntity.components.CSSModel.type+'" class="animate" data-entity="'+currentEntity.id+'"></div>')

              } else {
                  $('body').append('<div id="'+currentEntity.components.CSSModel.type+'" class="" data-entity="'+currentEntity.id+'"><div></div><div></div><div></div><div></div><div></div><div></div></div>')
              }
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

            $('[data-entity="'+currentEntity.id+'"]').css({
              top: y,
              left:x
            });

            /*
            //We could maybe add jumping to our little cube game with this.  An entity's Z changes and it would scale
            $('[data-entity="'+currentEntity.id+'"]').css({
              '-webkit-transform' : 'scale(' + z + ')',
              '-moz-transform'    : 'scale(' + z + ')',
              '-ms-transform'     : 'scale(' + z + ')',
              '-o-transform'      : 'scale(' + z + ')',
              'transform'         : 'scale(' + z + ')'
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

      attackDetection : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Attacker != "undefined") {
            $(window).trigger('attack', [currentEntity]);
          }
        }
      },

      bullets : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Bullet != "undefined") {
            if(typeof currentEntity.components.Bullet.destination == "undefined") {
              currentEntity.components.Bullet.destination = {x:ECS.Entities.Player.components.Position.x, y:ECS.Entities.Player.components.Position.y}
            }
            currentEntity.components.Bullet.timer--;
            //console.log(currentEntity.components.Bullet.destination.x)

            if(currentEntity.components.Bullet.timer <= 0) {
              $('[data-entity="'+currentEntity.id+'"]').remove();
              delete(_.where(window.entityArray, {'id': currentEntity.id}))
            }
          }
        }

        console.log(window.entityArray.length)
      }



    },

    getEntitiesCount : function() {
      return ECS.Entities.count;
    }
  };
});
