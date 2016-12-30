/* 
An entity is a player or enemy, which move, attack and have animated sprites associated with
them. The player class contains the necessary functions to make the player object move.
The update() function is the function the main game loop will call, and all changes are made from
there or from functions called from update().
*/

var EntityVerticalMovement = function(px_jump_force_y) {
  this.px_jump_force_y = px_jump_force_y;
  this.y_fall_speed_px = game_settings.entity.y_fall_speed_px;
  this.vertical_movement_px = 0; //On a jump order, this entity moves upwards by its px_jump_force_y.

  this.place_top_of_block = function() {
    //There is a block underneath, so make sure entity is on top of it, not halfway down.
    var y_pos_spaces = this.y_pos / game_settings.objects.blocks.high;
    this.y_pos = (Math.ceil(y_pos_spaces) * game_settings.objects.blocks.high);
  }

  this.move_y = function(){
    //Using Cartesian coordinates (bottom left 0,0), but canvas draws (top left 0).
    //The 1 in increments should be an option in game_settings
    this.vertical_movement_px -= 1;
    this.y_pos += this.vertical_movement_px;
  }
}

var EntityHorizontalMovement = function(px_per_move_x, x_move_speed_px) {
  this.px_per_move_x = px_per_move_x; // Minimum move distance in px. On move order, this object will move at least this distance.
  this.x_move_speed_px = x_move_speed_px;
  this.px_x_move_remaining = 0; //When there's a right or left event, this will be updated
  this.px_moved = 0;

  this.move_x = function(){
    //The 1 in increments should be an option in game_settings
  
    if (this.direction_facing == 'right') {
      this.x_pos += this.x_move_speed_px;
    } else {
      this.x_pos -= this.x_move_speed_px;
    }
    if (this.block_underneath) {
      this.px_x_move_remaining -= this.x_move_speed_px;
    }
  }
}

var EntityAnimation = function(sprite_sheet_left, sprite_sheet_right, sprite_map) {
  /*
  display_weapon_offset is used in animation. In the sprite sheets in css/sprites, characters have 
  a width of 20px but their weapons may extend 6px outwards.
  The animation uses mirror left and right sprite sheets, because flipping the canvas context to make
  a character change direction would have been complicated.
  The sprite_source_x and y are where the object's current sprite is on the sprite sheet. Update this
  when something happens, like a change in direction, etc. Those coordinates are contained in 
  js/sprite_map
  Attacks count once, but will take longer in animation.
  */
  this.sprite_sheet = new Image();
  this.sprite_map = sprite_map;
  this.sprite_source_width = game_settings.sprite.entity.source_wide;
  this.sprite_source_height = game_settings.sprite.entity.source_high;
  this.sprite_source_x = 0;
  this.sprite_source_y = 0;
  this.display_weapon_offset = (game_settings.positions.wide / game_settings.sprite.entity.source_wide)
      * game_settings.sprite.weapon_offset;
  this.sprite_sheet_left = sprite_sheet_left;
  this.sprite_sheet_right = sprite_sheet_right;
  this.sprite_sheet.src = null;
  this.feet_change_at = this.px_per_move_x / 2;
  this.attack_change_at = this.attack_duration / 2;

  this.update_sprite = function(direction, action) {
    var action_index = 0;

    if (direction == 'left') {
      this.sprite_sheet.src = this.sprite_sheet_left;
    } else {
      this.sprite_sheet.src = this.sprite_sheet_right;
    }

    if (action == 'step') {
      if (this.px_moved > this.feet_change_at) {
        action_index = 1;
      }
    } else if (action == 'jump') {
      if (this.vertical_movement > 0) {
        action_index = 1;
      }
    } else if (action == 'strike') {
      if (this.attacking_for > this.attack_change_at) {
        action_index = 1;
      }
    }
    this.sprite_source_x = sprite_map[action][action_index]['sx'];
    this.sprite_source_y = sprite_map[action][action_index]['sy'];
  }
}

var Entity = function(px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos){
  EntityHorizontalMovement.call(this, px_per_move_x, x_move_speed_px);
  EntityVerticalMovement.call(this, px_jump_force_y);

  //Physical properties
  this.wide = game_settings.entity.wide; //The area the entity stands on
  this.high = game_settings.entity.high; //The height of this entity
  this.x_pos = starting_x_pos * game_settings.positions.wide;
  this.y_pos = starting_y_pos * game_settings.positions.high;
  this.direction_facing = 'right'; //left
  this.falling = false; // true if no block under, false if player jumping.
  this.block_underneath = false;

  //Attacking
  this.attacking_for = 0;
  this.attack_duration = game_settings.entity.attack_duration;
  this.attacking = false;

  this.update = function(all_blocks){
    // Call from main loop. Control the entity. This is not the logic unit that tells the unit what
    // to do, but the function that completes the entity's turn in the game.

    if (this.attacking) {
      console.log(this.attacking_for, this.attack_duration);
      this.attacking_for ++;
      if (this.attacking_for >= this.attack_duration) {
        this.attacking = false;
        this.attacking_for = 0;
      } else {
        this.update_sprite(this.direction_facing, 'strike');
        return;
      }
    }

    this.block_underneath = this.check_block_underneath(all_blocks);

    //Update horizontally

    var collision_detected = this.detect_collision(all_blocks);

    if (collision_detected) {
      //An obstacle is in the entity's road, stop moving
      this.px_x_move_remaining = 0;
    }

    if (this.px_x_move_remaining > 0) {
      this.move_x();
      if (this.block_underneath) {
        //px_moved used in animation
        this.px_moved ++;
        if (this.px_moved > this.px_per_move_x) {
          this.px_moved = 0;
        }
        this.update_sprite(this.direction_facing, 'step');
      }
    }

    //Update vertically
 
    if (this.block_underneath && this.falling) {
      //The entity was falling but has landed on something, so make sure it is on top of the
      this.falling = false;
      this.place_top_of_block();
      this.vertical_movement_px = 0;
      this.px_x_move_remaining = 0;
    }

    if (!this.block_underneath && this.vertical_movement_px <= 0) {
      this.falling = true;
    }

    if (this.vertical_movement_px > 0) {
      this.update_sprite(this.direction_facing, 'jump');
      this.move_y();
      return;
    } else if (this.falling) {
      this.update_sprite(this.direction_facing, 'fall');
      this.move_y();
      return;
    }

    //If it's got this far, then the entity is not doing anything, make it appear still

    if (this.px_x_move_remaining == 0) {
      this.update_sprite(this.direction_facing, 'still');
    }
  }

  this.check_block_underneath = function(all_blocks) {
    var entity_left_side = this.x_pos;
    var entity_right_side = this.x_pos + this.wide;
    var entity_under_side = this.y_pos;
    var entity_centre = (entity_left_side + entity_right_side) / 2;

    for(var i = 0; i < all_blocks.length; i++){

      var block_left_side = all_blocks[i].x_pos;
      var block_right_side = all_blocks[i].x_pos + all_blocks[i].wide;
      var block_top_side = all_blocks[i].y_pos + all_blocks[i].high;
      var block_bottom_side = all_blocks[i].y_pos;

      if (entity_under_side <= block_top_side && entity_under_side > block_bottom_side) {
        if (entity_centre > block_left_side && entity_centre < block_right_side) {
          return true;
        } else if (entity_left_side > block_left_side && entity_left_side < block_right_side) {
          return true;
        } else if (entity_right_side > block_left_side && entity_right_side < block_right_side) {
          return true;
        }
      }
    }

    return false;
  }

  this.detect_collision = function(all_blocks) {
    //This looks very similar to the previous function, is there a way we can iterate over blocks
    //once rather than twice?
    var entity_left_side = this.x_pos;
    var entity_right_side = this.x_pos + this.wide;
    var entity_bottom_side = this.y_pos;
    var entity_top_side = this.y_pos + this.high;

    for(var i = 0; i < all_blocks.length; i++){

      var block_left_side = all_blocks[i].x_pos;
      var block_right_side = all_blocks[i].x_pos + all_blocks[i].wide;
      var block_bottom_side = all_blocks[i].y_pos;
      var block_top_side = all_blocks[i].y_pos + all_blocks[i].high;

      if ((entity_left_side == block_right_side && this.direction_facing == 'left') ||
        (entity_right_side == block_left_side && this.direction_facing == 'right')) {
        if (entity_bottom_side >= block_bottom_side && entity_bottom_side < block_top_side) {
          return true;
        } else if (entity_top_side > block_top_side && entity_top_side <= block_bottom_side) {
          return true;
        }
      }
    }

    return false;
  }
}

var Player = function(starting_x_pos, starting_y_pos) {
  //This is our basic player object - inherits from the Entity class
  var px_per_move_x = game_settings.player.px_per_move_x;
  var px_jump_force_y = game_settings.player.px_jump_force_y;
  var x_move_speed_px = game_settings.player.x_move_speed_px;
  var starting_x_pos = starting_x_pos;
  var starting_y_pos = starting_y_pos;
  Entity.call(this, px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos);
  
  var sprite_sheet_left = 'css/sprites/ninja_left.png';
  var sprite_sheet_right = 'css/sprites/ninja_right.png';
  var sprite_map = ninja_sprite_map;
  EntityAnimation.call(this, sprite_sheet_left, sprite_sheet_right, sprite_map);

  this.move_order = function(direction) {
    //If order to move is in the opposite direction, then the move is less (braking).
    if (!this.attacking) {
      if (this.direction_facing == direction) {
        var update_px_x_move_remaining = this.px_per_move_x;
      } else {
        var update_px_x_move_remaining = this.px_per_move_x - this.px_x_move_remaining;
      }
      this.px_x_move_remaining = update_px_x_move_remaining;

      if (direction == 'right') {
        this.direction_facing = 'right';
      } else {
        this.direction_facing = 'left';
      }
    }
  }
  this.jump_order = function() {
    if (this.block_underneath && !this.attacking) {
      this.vertical_movement_px = this.px_jump_force_y;
    }
  }
  this.attack_order = function() {
    if (this.block_underneath && !this.attacking) {
      this.attacking = true;
    }
  }
  this.stop_order = function() {
    if (this.block_underneath && !this.attacking) {
      this.px_x_move_remaining = 0;
    }
  }
}

var Skeleton = function(starting_x_pos, starting_y_pos) {
  var px_per_move_x = game_settings.enemies.px_per_move_x;
  var px_jump_force_y = game_settings.enemies.px_jump_force_y;
  var x_move_speed_px = game_settings.enemies.x_move_speed_px;
  var starting_x_pos = starting_x_pos;
  var starting_y_pos = starting_y_pos;
  Entity.call(this, px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos);

  var sprite_sheet_left = 'css/sprites/skeleton_left.png';
  var sprite_sheet_right = 'css/sprites/skeleton_right.png';
  var sprite_map = zombie_sprite_map
  EntityAnimation.call(this, sprite_sheet_left, sprite_sheet_right, sprite_map);

}

var Zombie = function(starting_x_pos, starting_y_pos) {
  var px_per_move_x = game_settings.enemies.px_per_move_x;
  var px_jump_force_y = game_settings.enemies.px_jump_force_y;
  var x_move_speed_px = game_settings.enemies.x_move_speed_px;
  var starting_x_pos = starting_x_pos;
  var starting_y_pos = starting_y_pos;
  Entity.call(this, px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos);

  var sprite_sheet_left = 'css/sprites/zombie_left.png';
  var sprite_sheet_right = 'css/sprites/zombie_right.png';
  var sprite_map = zombie_sprite_map
  EntityAnimation.call(this, sprite_sheet_left, sprite_sheet_right, sprite_map);

}
