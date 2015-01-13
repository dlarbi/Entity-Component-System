define(function () {
  ECS = {};
  ECS.Entities = {};
  ECS.Entities.count = 0;
  //Whenever you want to know which entity the player is.  This comes in handy a lot.
  ECS.Entities.Player = 0;

  return {
    //The references to APP and Models are so we can build entities inside our systems. (Ie creating projectiles in an attack system)
    initialize : function(APPLICATION, Models, UI, Utilities) {
      ECS.APP = APPLICATION;
      ECS.Models = Models;
      ECS.UI = UI;
      ECS.Utilities = Utilities;
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
      Velocity : function() {
        this.name = 'Velocity';
        this.dX = 0;
        this.dY = 0;
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
        this.DOMReference = "undefined";
        return this;
      },
      Collides : function(permeability) {
        this.name = "Collides";
        this.damage = 0;
        this.permeability = permeability;
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
        this.damage = 1;
        this.impactAnimation = '<img class="impactAnimation" src="./images/explode.gif"/>';
        return this;
      },
      Coin : function() {
        this.name = "Coin";
        var value = value || 5;
        this.value = value;
        return this;
      },
      Map : function() {
        this.name = "Map";
        this.type = "Dungeon";
        this.followPlayer = true;
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
          //Render CSSModels but not the World, we handle worlds elsewhere for now
          if(typeof currentEntity.components.CSSModel != "undefined" && typeof currentEntity.components.Map == "undefined") {
            //dont render the same element if it exists
            if(!$('[data-entity="'+currentEntity.id+'"]').length) {
              var type = currentEntity.components.CSSModel.type;
                el = $(currentEntity.components.CSSModel.model);
                el.attr('data-entity', currentEntity.id);
                $('#map').append(el);
            }
          }
          if(typeof currentEntity.components.Map != "undefined") {
            $('#map').attr('data-entity', currentEntity.id);
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
          }
        }
      },

      userInput : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.PlayerControlled != "undefined") {
            currentEntity.components.Position.x+=window.userInputX;
            currentEntity.components.Position.y+=window.userInputY;
            currentEntity.components.Position.z+=window.userInputZ;
          }

          if(typeof currentEntity.components.Map != "undefined") {
            if(currentEntity.components.Map.followPlayer == true) {
              currentEntity.components.Position.x = -ECS.Entities.Player.components.Position.x;
              currentEntity.components.Position.y = -ECS.Entities.Player.components.Position.y;
              currentEntity.components.Position.z-=window.userInputZ;
            }

          }
        }
        window.userInputX = window.userInputY = window.userInputZ = 0;
      },

      collisionDetection : function(entities) {
        var currentEntity;
        var otherEntity;
        var cssPos1;
        var cssPos2;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Collides != "undefined"){

            for(var j = 0; j < entities.length; j++){
              otherEntity = entities[j];
              if(typeof otherEntity.components.Collides != "undefined" && otherEntity.id != currentEntity.id){
                var xDist = Math.abs(currentEntity.components.Position.x - otherEntity.components.Position.x);
                var yDist = Math.abs(currentEntity.components.Position.y - otherEntity.components.Position.y);
                if(xDist < 100 && yDist < 100) {
                  if(otherEntity.id == ECS.Entities.Player.id) {
                    $(window).trigger('playerCollision', [currentEntity]);
                  }
                  if(currentEntity.id != ECS.Entities.Player.id) {
                    //We dont trigger a collision if both elements are projectiles
                    if (typeof currentEntity.components.Projectile == "undefined" || typeof otherEntity.components.Projectile == "undefined") {
                      //We only trigger the collision event when both the system's X & Y positions and the CSS positions are colliding
                      cssPos1 = ECS.Utilities.FindElementDocumentPosition($('[data-entity="'+currentEntity.id+'"]'));
                      cssPos2 = ECS.Utilities.FindElementDocumentPosition($('[data-entity="'+otherEntity.id+'"]'));
                      var xCssDist = Math.abs(cssPos1.left - cssPos2.left);
                      var yCssDist = Math.abs(cssPos1.top - cssPos2.top);
                      if(xCssDist < 100 && yCssDist < 100) {
                        $(window).trigger('collision', [otherEntity, currentEntity]);
                      }

                    }

                  }

                }
              }

            }

          }
        }
      },


      randomWalking : function(entities) {
          //Adds a random X and a random Y value to the position of any entity with the RandomWalker component
          //The dude walks around all crazy, the paramenter defined in the component is basically his speed. Doesn't let it walk out of bounds
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

        if(typeof collidedWithEntity.components.Collides != "undefined") {
          if(collidedWithEntity.components.Collides.permeability == 0 && ECS.Entities.Player.components.Collides.permeability == 0) {
            var playerX = ECS.Entities.Player.components.Position.x;
            var playerY = ECS.Entities.Player.components.Position.y;
            var collX = collidedWithEntity.components.Position.x;
            var collY = collidedWithEntity.components.Position.y;
            if(playerY < collY) {
              ECS.Entities.Player.components.Position.y = ECS.Entities.Player.components.Position.y - 30;
            } else {
              ECS.Entities.Player.components.Position.y = ECS.Entities.Player.components.Position.y + 30;
            }
            if(playerX < collX) {
              ECS.Entities.Player.components.Position.x = ECS.Entities.Player.components.Position.x - 30;
            } else {
              ECS.Entities.Player.components.Position.x = ECS.Entities.Player.components.Position.x + 30;
            }

          }
        }

        if(typeof collidedWithEntity.components.Coin != "undefined") {
          ECS.Entities.Player.components.Health.value+=collidedWithEntity.components.Coin.value;
          $('[data-entity="'+collidedWithEntity.id+'"]').remove();
          //To destroy an entity, we remove all of its components.  The entities with no components can be cleaned up later.  Must figure this out.
          collidedWithEntity.components = {};
        } else if(typeof collidedWithEntity.components.Projectile != "undefined" || typeof collidedWithEntity.components.Attacker != "undefined") {
          $('[data-entity="'+collidedWithEntity.id+'"]').remove();
          ECS.Entities.Player.components.Health.value-=1;
          collidedWithEntity.components = {};
        }
        console.log('Health: ' + ECS.Entities.Player.components.Health.value)
        ECS.UI.updatePlayerHealth(ECS.Entities.Player.components.Health.value);
      },

      entityImpact: function(evt, entity1, entity2) {
        //This branch represents a projectile entity1 colliding with an entity2 with health
        if(typeof entity1.components.Projectile != "undefined") {
          $('[data-entity="'+entity1.id+'"]').css('background', 'none!important');
          $('[data-entity="'+entity1.id+'"]').html(currentEntity.components.Projectile.impactAnimation);

          if(typeof entity2.components.Health != "undefined") {
            //console.log(entity1.components.Projectile.damage)
            entity2.components.Health.value-=entity1.components.Projectile.damage;
            entity1.components = {};
            setTimeout(function() {
              $('[data-entity="'+entity1.id+'"]').remove();
            }, 200)
            ECS.UI.updateEntityHealth(entity2);
            console.log(entity2.components.Health.value)
          }
        }
      },

      death: function(entities){
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Health != "undefined") {
            if(currentEntity.components.Health.value <= 0) {
              currentEntity.components = {};
              $('[data-entity="'+currentEntity.id+'"]').remove();
            }
          }
        }
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
          projectile.addComponent(new ECS.APP.Components.Projectile(ECS.Entities.Player.components.Position.x, ECS.Entities.Player.components.Position.y));
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
