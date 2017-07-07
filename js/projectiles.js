var NinjaStar = function(starting_x_pos, starting_y_pos, direction_facing){
  /*
  The ninja_star and Orb objects should inherit from here, also, they will have their own move speeds
  and could possibly using the EntityHorizontalMovement class in entiry_attributes. Further, is this
  an entity? Obvious is no because it's not an actor.
  The animation of this object, and all blocks, will share some stuff so can they be inherited?
  NOTE - on Saturday, you created folders for different sprites, change references in codebase.
  Also, you need to change the name of the background from Environment/ to Scenery/ for all js files.
  */

  var ninja_star_sprite_map = sprite_map.ninja_star;
  var spin_frames_number = ninja_star_sprite_map.spin.length;
  var px_per_spin = 90;
  var x_move_speed_px = game_settings.game_environment.objects.projectiles.x_move_speed_px;

  ProjectilePhysicalBeing.call(this, starting_x_pos, starting_y_pos, direction_facing) 
  ProjectileHorizontalMovement.call(this, px_per_spin, x_move_speed_px)
  ProjectileAnimation.call(this, ninja_star_sprite_map, spin_frames_number)

  this.sprite_sheet.src = 'css/sprites/environment/ninja_star.png';

  this.update = function() {
    this.move_x();
  }
}
