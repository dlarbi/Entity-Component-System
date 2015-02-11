Entity-Component-System
=======================

Study of ECS pattern for a game engine

Study of ECS pattern for a game engine. This repository builds a game with a player cube, some enemy cubes, collision detection, behaviors like health, attacking, matrix generated maps, events, damage on impact, and more. Download archive to play. All graphics are rendered with css, but see the more complete 3drpg version and note how easily extensible the ECS pattern is!

Create some Entities:

    var player = new ECS.Entity();
    var enemy = new ECS.Entity();
    
    //notice everything in the game is an entity
    var map = new ECS.Entity();
    
    //when we add a projectile when someone attacks, that will be an entity created at runtime,
    //inside a System like::
    //var bullet = new ECS.Entity();

![Alt text](/images/screenshot1.jpg?raw=true "Optional Title")

Add Components to your entities that identify what they are:

    //An entity's behavior in the game is defined by the components it holds.
    //For example, an entity with a CSSModel and Position component would probably be handled by 
    //a System.render() of some sort.
    player.addComponent(new ECS.Components.Health());
    player.addComponent(new ECS.Components.Position(1, 2));
    player.addComponent(new ECS.Components.PlayerControlled(player));
    player.addComponent(new ECS.Components.CSSModel(Models.cssCube()));

    map.addComponent(new ECS.Components.Map());
    map.addComponent(new ECS.Components.Position());
    
    enemy.addComponent(new ECS.Components.Health());
    enemy.addComponent(new ECS.Components.Position(600, 300));
    enemy.addComponent(new ECS.Components.CSSModel(Models.cssCube()));
    enemy.addComponent(new ECS.Components.Collides());
    enemy.addComponent(new ECS.Components.RandomWalker());

    var entityArray = [map, player, enemy];
Systems carry your game logic. Most systems run in a loop (not all**), and act upon any entities which carry the components for which it is responsible

    ECS.Systems.renderCSSModel(entityArray); //We render CSS models once, outside of game loop.  Only update positions and rotations in game loop.

    setInterval(function() {
      ECS.Systems.userInput(entityArray);
      ECS.Systems.randomWalking(entityArray);
      ECS.Systems.collisionDetection(entityArray);
      ECS.Systems.positionCSSModel(entityArray);
    }, 80);
