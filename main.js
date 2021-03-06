requirejs.config({
  baseUrl: 'scripts',
  paths: {
    helper: 'helper',
    app: 'app',
    assets: 'app/assets'
  }
});
require(["helper/util","app/ecs", "app/observers", "assets/3dModels", "app/UI"], function(Utilities, APP, Observers, Models, UI) {

  Utilities.mouseInputOn();
  Utilities.keyboardInputOn();
  APP.initialize(APP, Models, UI, Utilities);
  var player = new APP.Entity();
  var enemy = new APP.Entity();
  var building = new APP.Entity();

  var map = new APP.Entity();
  map.addComponent(new APP.Components.Position(1, 2, 1));
  map.addComponent(new APP.Components.Map());
  map.addComponent(new APP.Components.CSSModel({modelData : ''}));

  player.addComponent(new APP.Components.Health());
  player.addComponent(new APP.Components.Size(100));
  player.addComponent(new APP.Components.Position(20, 20, 1));
  player.addComponent(new APP.Components.PlayerControlled(player));
  player.addComponent(new APP.Components.CSSModel(Models.cssCube()));
  player.addComponent(new APP.Components.Attacker());
  player.addComponent(new APP.Components.Collides(0));

  enemy.addComponent(new APP.Components.Health());
  enemy.addComponent(new APP.Components.Size(100));
  enemy.addComponent(new APP.Components.Position(600, 300, 1));
  enemy.addComponent(new APP.Components.CSSModel(Models.cssCube()));
  enemy.addComponent(new APP.Components.Collides(0));
  enemy.addComponent(new APP.Components.RandomWalker(20)); //RandomWalker initialized with stepSize;

  var coin = new APP.Entity();
  coin.addComponent(new APP.Components.Position(100, 200, 1));
  coin.addComponent(new APP.Components.Size(50));
  coin.addComponent(new APP.Components.CSSModel(Models.cssCoin()));
  coin.addComponent(new APP.Components.Collides(1));
  coin.addComponent(new APP.Components.Coin());

  //Add/Remove health component from building to make the building destroyable. Same way as an enemy.
  //Sweet example of this architecture's awesome ability to maintain separation of concerns.
  building.addComponent(new APP.Components.Health());
  building.addComponent(new APP.Components.Size(400));
  building.addComponent(new APP.Components.Position(1600, 300, 1));
  building.addComponent(new APP.Components.CSSModel(Models.cssBigBuilding()));
  building.addComponent(new APP.Components.Collides(0));
  //enemy2.addComponent(new APP.Components.Attacker()); //We pass APP  and models so we can create new entities and components for bullets/arrows/etc within our attack methods

  window.entityArray = [map, player, enemy, coin, building];
  APP.Systems.buildMap(entityArray);
  APP.Systems.renderCSSModel(entityArray); //We render CSS models once, outside of game loop.  Only update positions and rotations in game loop.

  //We handle impacts by observing collision events with the player object.
  //The collision events are fired by APP.Systems like attackDetection() and collisionDetection()
  Observers.initialize(APP);
  Observers.collision();
  Observers.attack();
  setInterval(function() {
    APP.Systems.death(entityArray);

    APP.Systems.projectiles(entityArray);
    APP.Systems.attackDetection(entityArray);
    APP.Systems.randomWalking(entityArray);
    APP.Systems.collisionDetection(entityArray);
    APP.Systems.userInput(entityArray);
    APP.Systems.positionCSSModel(entityArray);
    //APP.Systems.render(entityArray); //This function renders things on the canvas.
  }, 80);

});
