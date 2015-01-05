requirejs.config({
  baseUrl: 'scripts',
  paths: {
    helper: 'helper',
    app: 'app',
    assets: 'app/assets'
  }
});
require(["helper/util", "app/ecs", "assets/3dModels"], function(Utilities, ECS, Models) {

  Utilities.mouseInputOn();
  Utilities.keyboardInputOn();
  var player = new ECS.Entity();
  var enemy = new ECS.Entity();
  var enemy2 = new ECS.Entity();

  player.addComponent(new ECS.Components.Health());
  player.addComponent(new ECS.Components.Position(1, 2, 1));
  player.addComponent(new ECS.Components.PlayerControlled(player));
  player.addComponent(new ECS.Components.CSSModel(Models.cssCube()));


  enemy.addComponent(new ECS.Components.Health());
  enemy.addComponent(new ECS.Components.Position(600, 300, 1));
  enemy.addComponent(new ECS.Components.CSSModel(Models.cssCube()));
  enemy.addComponent(new ECS.Components.Collides());
  enemy.addComponent(new ECS.Components.RandomWalker(100)); //RandomWalker initialized with stepSize;


  enemy2.addComponent(new ECS.Components.Health());
  enemy2.addComponent(new ECS.Components.Position(900, 300, 1));
  enemy2.addComponent(new ECS.Components.CSSModel(Models.cssCube()));
  enemy2.addComponent(new ECS.Components.Collides());
  //enemy2.addComponent(new ECS.Components.Attacker(ECS, Models)); //We pass ECS  and models so we can create new entities and components for bullets/arrows/etc within our attack methods

  window.entityArray = [player, enemy, enemy2];

  ECS.Systems.renderCSSModel(entityArray); //We render CSS models once, outside of game loop.  Only update positions and rotations in game loop.

  //We handle impacts by observing collision events with the player object.
  ECS.Systems.Observers.impactListener();
  ECS.Systems.Observers.attackListener();
  setInterval(function() {
    ECS.Systems.userInput(entityArray);
    //ECS.Systems.bullets(entityArray);
    ECS.Systems.attackDetection(entityArray);
    ECS.Systems.randomWalking(entityArray);

    ECS.Systems.collisionDetection(entityArray);
    ECS.Systems.positionCSSModel(entityArray);
    //ECS.Systems.render(entityArray); //This function renders things on the canvas.
  }, 80);

});
