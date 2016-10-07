//This is the class that the player and enemy classes inherit from
var Person = function(px_per_move_x, px_per_jump_y, starting_x_pos, starting_y_pos){
  /*
  When this is initialised, it will have a starting_pos of 1 or so. 
  That is to be multiplied by a constant, game_settings.positions.wide, to get its x_pos.
  This positioning system is used for initialising objects only, not afterwards.
  */

  this.direction_facing = 'right'; //Can also be left
  this.falling = false; // true if there's no platform underneath, provided the player hasn't jumped.
  this.platform_underneath = false;
  this.px_per_move_x = px_per_move_x; // Minimum move distance in px. Each key press, set this back to its default
  this.px_to_move_x = 0;  //When there's a right or left event, and the entity is on the ground, this will be updated
  this.px_per_jump_y = px_per_jump_y;
  this.px_to_jump_y = 0;
  this.wide = game_settings.player.wide;
  this.high = game_settings.player.high;
  this.x_pos = starting_x_pos * game_settings.positions.wide;
  this.y_pos = starting_y_pos * game_settings.positions.high;

  this.update = function(all_platforms){
    // This is the function to call from the loop. The entity will do what is told from here.
    // px_to_move_x will tell us if there's an order to move right or not.
    // NOTE - Jase does this contain stuff specific to the player, and should we have a seperate one for each instance?
    if (this.px_to_move_x >= 1) {
      this.move_x();
      this.px_to_move_x -= 1;
    }

    this.platform_underneath = this.check_platform_underneath(all_platforms);

    if (this.platform_underneath || this.px_to_jump_y > 0) {
      this.falling = false;
    } else if (this.platform_underneath == false && this.px_to_jump_y <= 0) {
      this.falling = true;
    }

    if (this.px_to_jump_y >= 1) {
      this.move_y();
      this.px_to_jump_y - 1;
    } else if (this.falling) {
      this.move_y();
    }

  }
  this.move_x = function(){
    //Updates the x_pos, gravity handled in another function
    if (this.direction_facing == 'right') {
      this.x_pos += 1;
    } else {
      this.x_pos -= 1;
    }
  }
  this.move_y = function(){
    //Updates y_pos, gravity or jumping
    //For now, we use cartesian coordinates, so starting from bottom left
    if (this.falling == true){
      this.y_pos -= 1;
    } else {
      this.y_pos += 1;
    }
  }
  this.check_platform_underneath = function(all_platforms) {
    var entity_left_side = this.x_pos;
    var entity_right_side = this.x_pos + this.wide;
    var entity_under_side = this.y_pos

    for(var i = 0; i < all_platforms.length; i++){

      var platform_left_side = all_platforms[i].x_pos;
      var platform_right_side = all_platforms[i].x_pos + all_platforms[i].wide;
      var platform_top_side = all_platforms[i].y_pos + all_platforms[i].high;

      if (entity_under_side == platform_top_side) {
        if (entity_left_side >= platform_left_side && entity_left_side <= platform_right_side) {
          return true;
        } else if (entity_right_side >= platform_left_side && entity_right_side <= platform_right_side) {
          return true;
        }
      }
    }

    // At this point, there was no platform detected underneath
    return false;

  }
}

//This is our basic player object
var Player = function(){
  var px_per_move_x = game_settings.player.px_per_move_x;
  var px_per_jump_y = game_settings.player.px_per_jump_y;
  var starting_x_pos = game_settings.player.starting_x_pos;
  var starting_y_pos = game_settings.player.starting_y_pos;
  Person.call(this, px_per_move_x, px_per_jump_y, starting_x_pos, starting_y_pos);
  this.move_order = function(direction){
    if (this.platform_underneath) {
      this.px_to_move_x = this.px_per_move_x;      
    }
    if (direction == 'right'){
      this.direction_facing = 'right';
    } else {
      this.direction_facing = 'left';
    }
  }
  this.jump_order = function(direction){
    //Only only the order if the player is not falling
    if (this.falling == false && this.platform_underneath){
      this.px_to_jump_y = this.px_per_jump_y;
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