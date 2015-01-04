define(function () {
  ECS = {};
  ECS.Entities = {};
  ECS.Entities.count = 0;

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
        value = value || 20;
        this.value = value;
        return this;
      },
      TakesDamage : function(multiplier){
        this.name = 'TakesDamage';
        this.multiplier = multiplier;
        return this;
      },
      Position : function(x,y) {
        this.name = 'Position';
        this.x = x;
        this.y = y;
        return this;
      },
      PlayerControlled : function() {
        this.name = 'PlayerControlled';
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
            $('body').append('<div id="'+currentEntity.components.CSSModel.type+'" class="animate" data-entity="'+currentEntity.id+'"><div></div><div></div><div></div><div></div><div></div><div></div></div>')
          }
        }
      },

      positionCSSModel : function(entities) {
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.CSSModel != "undefined") {
            var x = currentEntity.components.Position.x;
            var y = currentEntity.components.Position.y;
            $('[data-entity="'+currentEntity.id+'"]').css({
              top: y-50,
              left:x-970
            });
          }
        }
      },

      userInput : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.PlayerControlled != "undefined") {
            currentEntity.components.Position.x = window.userClickX;
            currentEntity.components.Position.y = window.userClickY;
          }
        }
      },

      collision : function(entities) {
        var currentEntity;
        window.currentPlayerPosition = window.currentPlayerPosition || {};
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];

          //Find where player entity currently is, so we can compare it with all other entities as we loop through them
          if(typeof currentEntity.components.PlayerControlled != "undefined") {
            currentPlayerPosition.x = currentEntity.components.Position.x;
            currentPlayerPosition.y = currentEntity.components.Position.y;
          } else {
            //If the player entity and another entity are within 100px of eachother, fire impact event.
            var xDistFromPlayer = Math.abs(currentEntity.components.Position.x - currentPlayerPosition.x);
            var yDistFromPlayer = Math.abs(currentEntity.components.Position.y - currentPlayerPosition.y);
            if(xDistFromPlayer < 100 && yDistFromPlayer < 100) {
              console.log('impact')
            }
          }
        }
      },

      damage : function(entities) {
      
      },
    },

    getEntitiesCount : function() {
      return ECS.Entities.count;
    }
  };
});
