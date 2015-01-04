requirejs.config({
  baseUrl: 'scripts',
  paths: {
    helper: 'helper',
    app: 'app',
    assets: 'app/assets'
  }
});
require(["app/ecs","helper/util", "assets/3dModels"], function(ECS, Utilities, Models) {

  Utilities.listenMouseClicks();
  var player = new ECS.Entity();
  var enemy = new ECS.Entity();

  player.addComponent(new ECS.Components.Health());
  player.addComponent(new ECS.Components.Position(1, 2));
  player.addComponent(new ECS.Components.PlayerControlled());
  player.addComponent(new ECS.Components.Model(Models.getPlayerModel()))

  enemy.addComponent(new ECS.Components.Health());
  enemy.addComponent(new ECS.Components.Position(600, 300));

  var entityArray = [player, enemy];

  setInterval(function() {

    ECS.Systems.userInput(entityArray);
    ECS.Systems.render(entityArray);
  }, 100);

});
