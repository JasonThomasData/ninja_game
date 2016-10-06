//This is the class that the player and enemy classes inherit from
var Person = function(px_per_move, starting_x_pos){
  this.direction_facing = 'right' //Can also be left
  this.falling = false // true if there's no platform underneath
  this.px_per_move_x = px_per_move // Minimum move distance in px. Each key press, set this back to its default
  this.px_to_move_x = 0  //When there's a right or left event, and the entity is on the ground, this will be updated
  this.x_pos = starting_x_pos
  this.update = function(){
    // This is the function to call from the loop. The entity will do what is told from here.
    // px_to_move_x will tell us if there's an order to move right or not.
    // NOTE - Jase does this contain stuff specific to the player, and should we have a seperate one for each instance?
    if (this.px_to_move_x > 0) {
      this.move_x();
      this.px_to_move_x -= 1;
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
}

//This is our basic player object
var Player = function(){
  var px_per_move = game_settings.player.px_per_move_x;
  var starting_x_pos = game_settings.player.starting_x_pos
  Person.call(this, px_per_move, starting_x_pos);
  this.move_order = function(direction){
    this.px_to_move_x = this.px_per_move_x;
    if (direction == 'right'){
      this.direction_facing = 'right';
    } else {
      this.direction_facing = 'left';
    }
  }
}

//This will not be part of the MVP
var Enemy = function(starting_x_pos){
  var px_per_move = game_settings.enemies.px_per_move_x;
  //This unit's starting x_pos should be nowhere near the player, perhaps at the edge of the screen
  Person.call(this, px_per_move, starting_x_pos)
  this.get_enemy_direction = function(){
    //Here, we want to make the enemy choose its direction based on what direction the player is.
  }
}