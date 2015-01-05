Entity-Component-System
=======================

Study of ECS pattern for a game engine.  This repository builds a game with a player cube, some enemy cubes, and collision
detection, a few behaviors, and damage on impact.  Will host example soon

Create some Entities:

    var player = new ECS.Entity();
    var enemy = new ECS.Entity();

Add Components to your entities that identify what they are:

    player.addComponent(new ECS.Components.Health());
    player.addComponent(new ECS.Components.Position(1, 2));
    player.addComponent(new ECS.Components.PlayerControlled(player));
    player.addComponent(new ECS.Components.CSSModel(Models.cssCube()));
    
    enemy.addComponent(new ECS.Components.Health());
    enemy.addComponent(new ECS.Components.Position(600, 300));
    enemy.addComponent(new ECS.Components.CSSModel(Models.cssCube()));
    enemy.addComponent(new ECS.Components.Collides());
    enemy.addComponent(new ECS.Components.RandomWalker());

Systems carry your game logic.  Most systems run in a loop (not all**), and acts upon any entities which carry the components for which it is responsible

    ECS.Systems.renderCSSModel(entityArray); //We render CSS models once, outside of game loop.  Only update positions and rotations in game loop.

    setInterval(function() {
      ECS.Systems.userInput(entityArray);
      ECS.Systems.randomWalking(entityArray);
      ECS.Systems.collisionDetection(entityArray);
      ECS.Systems.positionCSSModel(entityArray);
    }, 80);
