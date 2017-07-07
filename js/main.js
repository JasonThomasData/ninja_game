var Game = function() {

  this.objects = {
    "player" : null,
    "enemies" : [],
    "blocks" : [],
    "projectiles" : []
  }

  this.background = new Background();
  this.middleground = new Middleground();

  this.canvas = document.getElementById('drawing_board');
  this.canvas.width = game_settings.animation.frame.width;
  this.canvas.height = game_settings.animation.frame.height;
  this.ctx = this.canvas.getContext("2d");

  //Make sure images appear pixelated, not smoothed
  this.ctx.imageSmoothingEnabled = false;
  this.ctx.mozImageSmoothingEnabled = false;
  this.ctx.webkitImageSmoothingEnabled = false;
  this.ctx.msImageSmoothingEnabled = false;

  //Later, we'll offset the screen size and player coords so player always appears in screen centre
  this.player_x_context = 0;
  this.player_y_context = 0;

  this.game_update = function() {
    //This is an update, in the sense of one moment in time. Nothing to do with animation.
    var player = this.objects.player;
    var blocks = this.objects.blocks;
    var enemies = this.objects.enemies;
    var projectiles = this.objects.projectiles;
    if (player != null) {
      player.update(blocks);
    }
    for (var i = 0; i < enemies.length; i++) {
      var one_enemy = enemies[i];
      one_enemy.update(blocks);
    }
    for (var i = 0; i < projectiles.length; i++) {
      var one_projectile = projectiles[i];
      one_projectile.update();
    }
  }

  this.draw_scenery = function(scenery, scenery_x_movement_offset, scenery_y_movement_offset) {
    //TODO - Some serious duplication here - see above - can you put the specifics in the objects?

    var sprite_source_x = scenery.sprite_source_x;
    var sprite_source_y = scenery.sprite_source_y;
    var sprite_source_width = scenery.sprite_source_width;
    var sprite_source_height = scenery.sprite_source_height;
    var scenery_x_pos = scenery.x_pos;
    var scenery_y_pos = scenery.y_pos;
    var scenery_wide = scenery.wide;
    var scenery_high = scenery.high;

    scenery_x_pos = scenery_x_pos -= this.player_x_context/scenery_x_movement_offset;
    scenery_y_pos = scenery_y_pos += this.player_y_context/scenery_y_movement_offset;

    this.ctx.drawImage(scenery.sprite_sheet, sprite_source_x, sprite_source_y, sprite_source_width,
            sprite_source_height, scenery_x_pos, scenery_y_pos, scenery_wide,
            scenery_high);
  }

  this.draw_shape = function(object) {

    //The canvas draws from top left, but we count from bottom left, (Cartesian coords).
    var y_pos = (game_settings.animation.frame.height - object.high) - object.y_pos;

    //All objects need to be adjusted for showing in relation to the player in centre.
    y_pos += this.player_y_context;
    var x_pos = object.x_pos - this.player_x_context;

    var object_wide = object.wide;
    if (object.weapon_offset != undefined) {
      object_wide += object.weapon_offset;

      //Enlarge the shape the object appears in if it needs to show a weapon (only entities do this).
      if (object.direction_facing == 'left') {
        x_pos -= object.weapon_offset;
      }
    }

    var sprite_source_x = object.sprite_source_x;
    var sprite_source_y = object.sprite_source_y;

    this.ctx.drawImage(object.sprite_sheet, sprite_source_x, sprite_source_y, object.sprite_source_width,
            object.sprite_source_height, x_pos, y_pos, object_wide, object.high);

  }

  this.minimum_ms_per_game_loop = game_settings.game_environment.minimum_ms_per_game_loop;
  this.time_last_game_loop = new Date();
  this.check_time_passed = function() {
    /*
    I want all users to have roughly the same experience, so if a PC is running fast, then limit its
    updates. Running slowly? Too bad fellah.
    */
    var time_now = new Date();
    var time_since_last_loop = time_now.getTime() - this.time_last_game_loop.getTime();
    if (time_since_last_loop >= this.minimum_ms_per_game_loop) {
      this.time_last_game_loop = time_now;
      return true;
    }
    return false;
  }

  this.max_fps = game_settings.animation.max_fps;
  this.time_game_last_rendered = new Date();
  this.check_frame_rate = function() {
    /*
    Record the last time we gave the signal to render the game. Get the difference between that and
    the time now. If the time_since_last_render * max_fps (frames per second) is more than 1000, then
    the animation is not going too fast for us to render it. 30 fps is ideal, but add another 5 for
    the time taken to get dates and other computations.

    TODO - there looks like there's some duplication with this and the above function. Can this be
    made more abstract.
    */
    var time_now = new Date();
    var time_since_last_render = time_now.getTime() - this.time_game_last_rendered.getTime();
    if (time_since_last_render * this.max_fps > 1000) {
      this.time_game_last_rendered = new Date();
      return true;
    }
    return false;
  }

  this.game_render = function() {
    //TODO - have a function to check an object is within the screen boundaries before rendering.

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player_x_context = 0;

    var player = this.objects.player;
    var blocks = this.objects.blocks;
    var enemies = this.objects.enemies;
    var projectiles = this.objects.projectiles;

    //Set the context for drawing objects with the player in centre screen.
    if (player != null) {
      this.player_x_context = player.x_pos - game_settings.animation.frame.centre.x + (player.wide / 2);
      this.player_y_context = player.y_pos - game_settings.animation.frame.centre.y + player.high;
    }

    var background = this.background;
    var background_x_movement_offset = 40;
    var background_y_movement_offset = 60;
    this.draw_scenery(background, background_x_movement_offset, background_y_movement_offset);
    
    var middleground = this.middleground;
    var middleground_x_movement_offset = 20;
    var middleground_y_movement_offset = 30;
    this.draw_scenery(middleground, middleground_x_movement_offset, middleground_y_movement_offset);

    //Draw all blocks, obstacles
    for (var i = 0; i < blocks.length; i++) {
      var one_block = blocks[i];
      this.draw_shape(one_block);
    }

    //Draw enemies
    for (var i = 0; i < enemies.length; i++) {
      var one_enemy = enemies[i];
      this.draw_shape(one_enemy);
    }

    //Draw projectiles
    for (var i = 0; i < projectiles.length; i++) {
      var one_projectile = projectiles[i];
      this.draw_shape(one_projectile);
    }

    //Draw player
    if (player != null) {
      this.draw_shape(player);
    }

  }

  this.fit_window = function() {
  }
}

var current_game = new Game();

//See js/game_init.js
var map_name = get_query_string();
var map_location = game_settings.game_init.maps_folder;
var objects = current_game.objects;
load_map(map_location, map_name, objects);

function game_loop() {
  /*
  These function calls make sure the experience is the same for everyone. It caps the passage of
  time, so if JS speed gets better, the experience is the same. There is a maximum FPS, because
  humans can only perceive around 35 FPS at best.
  */
  if (current_game.check_time_passed()) {
    current_game.game_update();
    if (current_game.check_frame_rate()) {
      current_game.game_render();
    }
  }
  requestAnimationFrame(game_loop);
}
game_loop();
