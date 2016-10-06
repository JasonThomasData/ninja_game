//This is the class that the player and enemy classes inherit from
var Person = function(px_per_move, px_per_render){
  this.move_status = 'still' //Can also be running
  this.direction_facing = 'right' //Can also be left
  this.falling = false // true if there's no platform underneath
  this.px_per_move = px_per_move // Minimum move distance in px. Each key press, set this back to its default
  this.px_per_render = px_per_render //This dictates the speed at which this object moves
}

//This is our basic player object
var Player = function(px_per_move, px_per_render){
  Person.call(this, px_per_move, px_per_render);
}

//This will not be part of the MVP
var Enemy = function(px_per_move, px_per_render){
  Person.call(this, px_per_move, px_per_render)

  this.get_enemy_direction = function(){
    //Here, we want to make the enemy choose its direction based on what direction the player is.
  }
}