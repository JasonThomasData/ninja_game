
var Game = function() {
  this.objects = {
    "player" : null,
    "enemies" : [],
    "blocks" : []
  }

  this.canvas = document.getElementById('drawing_board');
  this.canvas.width = game_settings.animation.frame.width;
  this.canvas.height = game_settings.animation.frame.height;
  this.ctx = this.canvas.getContext("2d");

  //Make sure images appear pixelated, not smoothed
  this.ctx.imageSmoothingEnabled = false;
  this.ctx.mozImageSmoothingEnabled = false;
  this.ctx.webkitImageSmoothingEnabled = false;
  this.ctx.msImageSmoothingEnabled = false;

  this.player_x_context = 0;
  this.player_y_context = 0;

  this.game_update = function() {
    var player = this.objects['player'];
    var blocks = this.objects['blocks'];
    var enemies = this.objects['enemies'];
    if (player != null) {
      player.update(blocks);
    }
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].update(blocks);
    }
  }

  this.draw_shape = function(object) {
    /*
    The canvas draws from top left, but we count from bottom left.
    All objects need to be adjusted for showing in relation to the player in centre.
    This is where you enlarge the shape the object is in if it needs to show a weapon.
    */
    var y_pos = (game_settings.animation.frame.height - object.high) - object.y_pos;
    y_pos += this.player_y_context;
    var x_pos = object.x_pos - this.player_x_context;
    var object_wide = object.wide;
    if (object.direction_facing == 'left') {
      x_pos -= (object.display_weapon_offset - 1);
    }
    if (object.display_weapon_offset != undefined) {
      object_wide += object.display_weapon_offset;
    }
    var sprite_source_x = object.sprite_source_x;
    var sprite_source_y = object.sprite_source_y;
    this.ctx.drawImage(object.sprite_sheet, sprite_source_x, sprite_source_y, object.sprite_source_width,
            object.sprite_source_height, x_pos, y_pos, object_wide, object.high);
  }

  this.game_render = function() {
    //Would be good to reduce the amount of objects to render so it's only those in the screen
    //limits.

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player_x_context = 0;

    var player = this.objects['player'];
    var blocks = this.objects['blocks'];
    var enemies = this.objects['enemies'];

    //Set the context for drawing objects with the player in centre screen.
    if (player != null) {
      this.player_x_context = player.x_pos - game_settings.animation.frame.centre.x;
      this.player_y_context = player.y_pos - game_settings.animation.frame.centre.y;
    }

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

    //Draw player
    if (player != null) {
      this.draw_shape(player);
    }
  }
}

var current_game = new Game();

//See js/game_init.js
var map_name = get_query_string();
var map_location = game_settings.game.maps_folder;
var objects = current_game.objects;
load_map(map_location, map_name, objects);

function game_loop() {
  current_game.game_update();
  current_game.game_render();
  requestAnimationFrame(game_loop);
}
game_loop()
