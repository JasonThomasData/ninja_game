var Person = function(px_per_move_x, px_per_jump_y, starting_x_pos, starting_y_pos){
  /*
  When this is initialised, it will have a starting_pos of 1 or so. 
  That is to be multiplied by a constant, game_settings.positions.wide, to get its x_pos.
  This positioning system is used for initialising objects only, not afterwards.
  */

  this.direction_facing = 'right'; //left
  this.falling = false; // true if no platform under, false if player jumping.
  this.platform_underneath = false;
  this.px_per_move_x = px_per_move_x; // Minimum move distance in px. Each key press, set this back to its default
  this.px_x_move_remaining = 0;  //When there's a right or left event, and the entity is on the ground, this will be updated
  this.px_per_jump_y = px_per_jump_y;
  this.px_y_jump_remaining = 0;
  this.wide = game_settings.player.wide;
  this.high = game_settings.player.high;
  this.x_pos = starting_x_pos * game_settings.positions.wide;
  this.y_pos = starting_y_pos * game_settings.positions.high;
  this.update = function(all_platforms){
    // Call from main loop. Control the entity.

    this.platform_underneath = this.check_platform_underneath(all_platforms);

    var collision_detected = this.detect_collision(all_platforms);
    if (collision_detected) {
      this.px_x_move_remaining = 0;
    }

    if (this.platform_underneath || this.px_y_jump_remaining > 0) {
      this.falling = false;
    } else if (this.platform_underneath == false && this.px_y_jump_remaining <= 0) {
      this.falling = true;
    }

    this.move_x();
    this.move_y();
  }
  this.move_x = function(){
    //The 1 in increments should be an option in game_settings
    if (this.px_x_move_remaining >= 1) {
      if (this.direction_facing == 'right') {
        this.x_pos += 1;
      } else {
        this.x_pos -= 1;
      }
      if (this.platform_underneath) {
        this.px_x_move_remaining -= 1;
      }
    }
  }
  this.move_y = function(){
    //Updates - gravity or jumping
    //Using cartesian coordinates (bottom left 0), but canvas draws (top left 0).
    //The 1 in increments should be an option in game_settings
    if (this.px_y_jump_remaining >= 1) {
      this.y_pos += 2;
      this.px_y_jump_remaining -= 1;
    } else if (this.falling) {
      this.y_pos -= 2;
    }
  }
  this.check_platform_underneath = function(all_platforms) {
    var entity_left_side = this.x_pos;
    var entity_right_side = this.x_pos + this.wide;
    var entity_under_side = this.y_pos;
    var entity_centre = (entity_left_side + entity_right_side) / 2;

    for(var i = 0; i < all_platforms.length; i++){

      var platform_left_side = all_platforms[i].x_pos;
      var platform_right_side = all_platforms[i].x_pos + all_platforms[i].wide;
      var platform_top_side = all_platforms[i].y_pos + all_platforms[i].high;

      if (entity_under_side == platform_top_side) {
        if (entity_centre > platform_left_side && entity_centre < platform_right_side) {
          return true;
        } else if (entity_left_side > platform_left_side && entity_left_side < platform_right_side) {
          return true;
        } else if (entity_right_side > platform_left_side && entity_right_side < platform_right_side) {
          return true;
        }
      }
    }

    return false;
  }
  this.detect_collision = function(all_platforms) {

    var entity_left_side = this.x_pos;
    var entity_right_side = this.x_pos + this.wide;
    var entity_bottom_side = this.y_pos;
    var entity_top_side = this.y_pos + this.high;

    for(var i = 0; i < all_platforms.length; i++){

      var platform_left_side = all_platforms[i].x_pos;
      var platform_right_side = all_platforms[i].x_pos + all_platforms[i].wide;
      var platform_bottom_side = all_platforms[i].y_pos;
      var platform_top_side = all_platforms[i].y_pos + all_platforms[i].high;

      if ((entity_left_side == platform_right_side && this.direction_facing == 'left') ||
        (entity_right_side == platform_left_side && this.direction_facing == 'right')) {
        if (entity_bottom_side >= platform_bottom_side && entity_bottom_side < platform_top_side) {
          return true;
        } else if (entity_top_side > platform_top_side && entity_top_side <= platform_bottom_side) {
          return true;
        }
      }
    }

    return false;
  }
}

//This is our basic player object - inherits from the Person class
var Player = function(){
  var px_per_move_x = game_settings.player.px_per_move_x;
  var px_per_jump_y = game_settings.player.px_per_jump_y;
  var starting_x_pos = game_settings.player.starting_x_pos;
  var starting_y_pos = game_settings.player.starting_y_pos;
  Person.call(this, px_per_move_x, px_per_jump_y, starting_x_pos, starting_y_pos);
  this.move_order = function(direction) {
    //Move order effective if entity is on ground.
    if (this.platform_underneath) {
      //If order to move is in the opposite direction, then the move is less (braking).
      if (this.direction_facing == direction) {
        var update_px_x_move_remaining = this.px_per_move_x;
      } else {
        var update_px_x_move_remaining = this.px_per_move_x - this.px_x_move_remaining;
      }
      this.px_x_move_remaining = update_px_x_move_remaining;
    }
    //The entity can always change its facing direction, including while jumping.
    if (direction == 'right'){
      this.direction_facing = 'right';
    } else {
      this.direction_facing = 'left';
    }
  }
  this.jump_order = function(direction){
    if (this.platform_underneath){
      this.px_y_jump_remaining = this.px_per_jump_y;
    }
  }
  this.stop_order = function(direction){
    if (this.platform_underneath){
      this.px_x_move_remaining = 0;
    }
  }
  this.stop_order = function(direction){
    if (this.platform_underneath){
      this.px_to_move_x = 0;
    }
  }
}

//This will not be part of the MVP - enemy shares some properties of player but is initialised differently
var Enemy = function(starting_x_pos, starting_y_pos){
  var px_per_move_x = game_settings.enemies.px_per_move_x;
  var px_per_jump_y = game_settings.enemies.px_per_jump_y;
  //This unit's starting x_pos should be nowhere near the player, perhaps at the edge of the screen
  Person.call(this, px_per_move_x, px_per_jump_y, starting_x_pos, starting_y_pos);
  this.get_enemy_direction = function(){
    //Here, we want to make the enemy choose its direction based on what direction the player is.
  }
}
