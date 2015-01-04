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
      Model : function(modelData) {
        this.name = '3dModel';
        this.data = modelData;
        return this;
      }
    },

    Systems : {
      render : function(entities) {
        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        ctx.clearRect ( 0 , 0 , c.width, c.height );

        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Position != "undefined") {
            var x = currentEntity.components.Position.x;
            var y = currentEntity.components.Position.y;
            ctx.fillRect(x,y,150,100);
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
      }
    },

    getEntitiesCount : function() {
      return ECS.Entities.count;
    }
  };
});
