requirejs.config({
  baseUrl: 'scripts',
  paths: {
    helper: 'helper',
    app: 'app',
    assets: 'app/assets'
  }
});
require(["helper/util","app/ecs", "app/observers", "assets/3dModels"], function(Utilities, APP, Observers, Models) {

  Utilities.mouseInputOn();
  Utilities.keyboardInputOn();
  APP.initialize(APP, Models);
  var player = new APP.Entity();
  var enemy = new APP.Entity();
  var enemy2 = new APP.Entity();

  player.addComponent(new APP.Components.Health());
  player.addComponent(new APP.Components.Position(1, 2, 1));
  player.addComponent(new APP.Components.PlayerControlled(player));
  player.addComponent(new APP.Components.CSSModel(Models.cssCube()));
  player.addComponent(new APP.Components.Attacker());

  enemy.addComponent(new APP.Components.Health());
  enemy.addComponent(new APP.Components.Position(600, 300, 1));
  enemy.addComponent(new APP.Components.CSSModel(Models.cssCube()));
  enemy.addComponent(new APP.Components.Collides());
  enemy.addComponent(new APP.Components.RandomWalker(100)); //RandomWalker initialized with stepSize;

  var coin = new APP.Entity();
  coin.addComponent(new APP.Components.Position(100, 200, 1));
  coin.addComponent(new APP.Components.CSSModel(Models.cssCoin()));
  coin.addComponent(new APP.Components.Collides());
  coin.addComponent(new APP.Components.Coin());

  enemy2.addComponent(new APP.Components.Health());
  enemy2.addComponent(new APP.Components.Position(900, 300, 1));
  enemy2.addComponent(new APP.Components.CSSModel(Models.cssCube()));
  enemy2.addComponent(new APP.Components.Collides());
//  enemy2.addComponent(new APP.Components.Attacker()); //We pass APP  and models so we can create new entities and components for bullets/arrows/etc within our attack methods

  window.entityArray = [player, enemy, coin, enemy2];

  APP.Systems.renderCSSModel(entityArray); //We render CSS models once, outside of game loop.  Only update positions and rotations in game loop.

  //We handle impacts by observing collision events with the player object.
  //The collision events are fired by APP.Systems like attackDetection() and collisionDetection()
  Observers.initialize(APP);
  Observers.collision();
  Observers.attack();
  setInterval(function() {
    APP.Systems.userInput(entityArray);
    APP.Systems.projectiles(entityArray);
    APP.Systems.attackDetection(entityArray);
    APP.Systems.randomWalking(entityArray);

    APP.Systems.collisionDetection(entityArray);
    APP.Systems.positionCSSModel(entityArray);
    //APP.Systems.render(entityArray); //This function renders things on the canvas.
  }, 80);

});
