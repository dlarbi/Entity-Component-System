define(function () {
  this.id = (+new Date()).toString(16) +
  (Math.random() * 100000000 | 0).toString(16) +
  ECS.Entities.count;

  ECS.Entities.count++;
  this.components = {};
  return {


    addComponent : function(component) {
      this.components[component.name] = component;
      return this;
    },

    removeComponent : function(component) {
      var name = component;
      if(typeof component === 'function'){
        name = component.prototype.name;
      }
      delete this.components[name];
      return this;
    },

    print : function print () {
      console.log(JSON.stringify(this, null, 4));
      return this;
    }
  };
});
