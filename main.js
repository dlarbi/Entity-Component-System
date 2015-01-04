requirejs.config({
  baseUrl: 'scripts',
  paths: {
    helper: 'helper',
    app: 'app',
    assets: 'app/assets'
  }
});
require(["app/ecs","helper/util", "assets/3dModels"], function(ECS, Utilities, Models) {

  Utilities.mouseInputOn();
  var player = new ECS.Entity();
  var enemy = new ECS.Entity();

  player.addComponent(new ECS.Components.Health());
  player.addComponent(new ECS.Components.Position(1, 2));
  player.addComponent(new ECS.Components.PlayerControlled());
  player.addComponent(new ECS.Components.CSSModel(Models.cssCube()))

  enemy.addComponent(new ECS.Components.Health());
  enemy.addComponent(new ECS.Components.Position(600, 300));
  enemy.addComponent(new ECS.Components.CSSModel(Models.cssCube()))

  var entityArray = [player, enemy];

  ECS.Systems.renderCSSModel(entityArray); //We render CSS models once, outside of game loop.  Only update positions and rotations in game loop.

  setInterval(function() {
    ECS.Systems.userInput(entityArray);
    ECS.Systems.positionCSSModel(entityArray);
    ECS.Systems.collision(entityArray);
    //ECS.Systems.render(entityArray); //This function renders things on the canvas.
  }, 80);

});
