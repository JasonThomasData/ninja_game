/*
There are a lot of things here that the entity objects share. EG - horizontal movement.
Consider having a physics module to handle all things of that nature. Collision detection, etc.
*/

var ProjectileHorizontalMovement = function(px_per_spin, x_move_speed_px) {
  this.px_per_spin = px_per_spin;
  this.x_move_speed_px = x_move_speed_px;
  this.px_moved = 0;

  this.move_x = function(){
    //Updates this projectile's position, each frame/moment in game
    if (this.direction_facing == 'right') {
      this.x_pos += this.x_move_speed_px;
    } else {
      this.x_pos -= this.x_move_speed_px;
    }

    //px_moved used in animating the sprite's spinning.
    this.px_moved += this.x_move_speed_px;
    if (this.px_moved >= this.px_per_spin) {
      this.px_moved = 0;
    }

    this.update_sprite();
  }
}

var ProjectileAnimation = function(sprite_map, spin_frames_number) {

  this.sprite_sheet = new Image();
  this.sprite_map = sprite_map;
  this.sprite_sheet.src = 'css/sprites/environment/ninja_star.png';
  this.sprite_source_x = 0;
  this.sprite_source_y = 0;
  this.sprite_source_width = game_settings.sprite.objects.projectiles.source_wide;
  this.sprite_source_height = game_settings.sprite.objects.projectiles.source_high;
 
  this.spin_change_at = this.px_per_spin / spin_frames_number;

  this.update_sprite = function() {
    /*
    All projectiles have a spin index. That just ensures the projectile changes frequently during
    its move horizontally.
    */

    var spin_index = 0;

    if (this.px_moved < this.spin_change_at) {
      spin_index = 0;
    } else if (this.px_moved < this.spin_change_at * 2) {
      spin_index = 1;
    } else if (this.px_moved < this.spin_change_at * 3) {
      spin_index = 2;
    } else if (this.px_moved < this.spin_change_at * 4) {
      spin_index = 3;
    } else if (this.px_moved < this.spin_change_at * 5) {
      spin_index = 4;
    }

    this.sprite_source_x = this.sprite_map.spin[spin_index]['sx'];
    this.sprite_source_y = this.sprite_map.spin[spin_index]['sy'];
  }

}

var ProjectilePhysicalBeing = function(starting_x_pos, starting_y_pos, direction_facing) {
  /*
  Control how this entity behaves with the world around it. Collision detection, attacking, etc.
  The entity's place in the world is defined here, but updating that place is defined elsewhere.
  */

  this.wide = game_settings.game_environment.objects.projectiles.wide; //The area the entity stands on
  this.high = game_settings.game_environment.objects.projectiles.high; //The height of this entity
  this.x_pos = starting_x_pos;
  this.y_pos = starting_y_pos;
  this.direction_facing = direction_facing;
  this.thing_struck = null;

  this.check_collision = function(all_blocks, relevant_entities) {
    //This looks very similar to the functions in EntityPhysicalBeing. Must be a way to abstract all of these.

    var projectile_left_side = this.x_pos;
    var projectile_right_side = this.x_pos + this.wide;
    var projectile_bottom_side = this.y_pos;
    var projectile_top_side = this.y_pos + this.high;

    for(var i = 0; i < all_blocks.length; i++){

      var this_block = all_blocks[i];

      var block_left_side = this_block.x_pos;
      var block_right_side = this_block.x_pos + this_block.wide;
      var block_bottom_side = this_block.y_pos;
      var block_top_side = this_block.y_pos + this_block.high;

      var block_on_left = entity_left_side > block_left_side && entity_left_side <= block_right_side;
      var block_on_right = entity_right_side >= block_left_side && entity_right_side < block_right_side;

      if ((block_on_left && this.direction_facing == 'left') || 
        (block_on_right && this.direction_facing == 'right')) {
        if ((entity_bottom_side >= block_bottom_side && entity_bottom_side < block_top_side) ||
        (entity_top_side < block_top_side && entity_top_side >= block_bottom_side)) {
          return true;
        }
      }
    }

    for(var i = 0; i < relevant_entities.length; i++){

      var this_entity = relevant_entities[i];

      var entity_left_side = this_entity.x_pos;
      var entity_right_side = this_entity.x_pos + this_entity.wide;
      var entity_bottom_side = this_entity.y_pos;
      var entity_top_side = this_entity.y_pos + this_entity.high;

      var entity_on_left = entity_left_side > entity_left_side && entity_left_side <= entity_right_side;
      var entity_on_right = entity_right_side >= entity_left_side && entity_right_side < entity_right_side;

      if ((entity_on_left && this.direction_facing == 'left') || 
        (entity_on_right && this.direction_facing == 'right')) {
        if ((entity_bottom_side >= entity_bottom_side && entity_bottom_side < entity_top_side) ||
        (entity_top_side < entity_top_side && entity_top_side >= entity_bottom_side)) {
          this.thing_struck = this_entity;
          return true;
        }
      }
    }

    return false;
  }

}
