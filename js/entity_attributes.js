/*
Entities inherit these.
*/

var EntityVerticalMovement = function(px_jump_force_y) {
  this.px_jump_force_y = px_jump_force_y;
  this.y_fall_speed_px = game_settings.entity.y_fall_speed_px;
  this.vertical_movement_px = 0;

  this.new_jump = function() {
    // Called on an order to jump
    this.vertical_movement_px = this.px_jump_force_y;
  }

  this.stop_falling = function() {
    // The entity has landed on something.
    this.falling = false;
    this.vertical_movement_px = 0;
    this.px_x_move_remaining = 0;
  }

  this.place_top_of_block = function() {
    //There is a block underneath, so make sure entity is on top of it, not halfway down.
    var y_pos_spaces = this.y_pos / game_settings.objects.blocks.high;
    this.y_pos = (Math.ceil(y_pos_spaces) * game_settings.objects.blocks.high);
  }

  this.move_y = function(){
    //Using Cartesian coordinates (bottom left 0,0), but canvas draws (top left 0).
    //Updates this entity's position, each frame/moment
    this.vertical_movement_px -= this.y_fall_speed_px;
    this.y_pos += this.vertical_movement_px;
  }
}

var EntityHorizontalMovement = function(px_per_move_x, x_move_speed_px) {
  this.px_per_move_x = px_per_move_x;
  this.x_move_speed_px = x_move_speed_px;
  this.px_x_move_remaining = 0;
  this.px_moved = 0;

  this.stop_x_move = function() {
    this.px_moved = 0;
    this.px_x_move_remaining = 0;
  }

  this.place_side_of_block = function() {
    //This has ended up in a block, so move it back out.
    var x_pos_spaces = this.x_pos / game_settings.objects.blocks.wide;
    this.x_pos = (Math.round(x_pos_spaces) * game_settings.objects.blocks.wide);
  }

  this.new_move = function(direction) {
    //This entity has received a new order to move.    
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

  this.move_x = function(){
    //Updates this entity's position, each frame/moment in game
    if (this.direction_facing == 'right') {
      this.x_pos += this.x_move_speed_px;
    } else {
      this.x_pos -= this.x_move_speed_px;
    }

    if (this.block_underneath) {
      /*
      px_moved - used in animation. px_x_move_remaining can not be used here, because that is
      reset every move order, but legs should move even on continuous keydown.
      */ 
      this.px_x_move_remaining -= this.x_move_speed_px;
      this.px_moved += this.x_move_speed_px;
      if (this.px_moved >= this.px_per_move_x) {
        this.px_moved = 0;
      }
      this.update_sprite(this.direction_facing, 'step');
    }
  }
}

var EntityAnimation = function(sprite_sheet_left, sprite_sheet_right, sprite_map, attack_frames_number,
  death_frames_number, step_frames_number) {
  /*
  display_weapon_offset is used in drawing the canvas. In the sprite sheets in css/sprites, characters
  have a width of 20px but the space for their weapons extends 6px outwards.
  The animation uses mirror left and right sprite sheets, because flipping the canvas context to make
  a character change direction would have been complicated.
  The sprite_source_x and sprite_source_y are where the object's current sprite is on the sprite sheet.
  Update this when something happens, like a change in direction, etc. Those coordinates are contained
  in js/sprite_map
  Attacks hurt an opponent once, but will an attack animation takes several frames.
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

  this.feet_change_at = this.px_per_move_x / step_frames_number;
  this.attack_change_at = this.attack_duration / attack_frames_number;
  this.death_change_at = this.death_duration / death_frames_number;

  this.update_sprite = function(direction, action) {
    /*
    By default, use the first image in the sprite_map for any given action, unless the we tell the
    animation to use a different one.
    Entities have a left and a right sprite sheet. They are mirror images of the same thing.
    */
    var action_index = 0;

    //jump, fall, still for every entity is always action_index = 0

    if (direction == 'left') {
      this.sprite_sheet.src = this.sprite_sheet_left;
    } else {
      this.sprite_sheet.src = this.sprite_sheet_right;
    }

    if (action == 'step') {
      if (this.px_moved < this.feet_change_at) {
        action_index = 0;
      } else if (this.px_moved < this.feet_change_at*2) {
        action_index = 1;
      } else if (this.px_moved < this.feet_change_at*3) {
        action_index = 2;
      } else if (this.px_moved < this.feet_change_at*4) {
        action_index = 3;
      }
    } else if (action == 'strike') {
      if (this.attacking_for < this.attack_change_at) {
        action_index = 0;
      } else if (this.attacking_for < this.attack_change_at*2) {
        action_index = 1;
      } else if (this.attacking_for < this.attack_change_at*3) {
        action_index = 2;
      }
    }

    this.sprite_source_x = sprite_map[action][action_index]['sx'];
    this.sprite_source_y = sprite_map[action][action_index]['sy'];
  }

}

var EntityPhysicalBeing = function(starting_x_pos, starting_y_pos, entity_type) {
  /*
  Control how this entity behaves with the world around it. Collision detection, attacking, etc.
  The entity's place in the world is defined here, but updating that place is defined elsewhere.
  */
  this.wide = game_settings.entity.wide; //The area the entity stands on
  this.high = game_settings.entity.high; //The height of this entity
  this.x_pos = starting_x_pos * game_settings.positions.wide;
  this.y_pos = starting_y_pos * game_settings.positions.high;
  this.direction_facing = 'right'
  this.falling = false; // true if no block under, false if player jumping.
  this.block_underneath = false;
  this.attacking_for = 0;
  this.attack_duration = game_settings[entity_type].attack_duration;
  this.attacking = false;

  this.new_attack = function() {
    this.attacking = true;
  }

  this.continue_attack = function() {
    this.attacking_for ++;
  }

  this.end_attack= function() {
    this.attacking = false;
    this.attacking_for = 0;
  }

  this.check_block_underneath = function(all_blocks) {
    // It would be smart to only consider the top layer of blocks for this. Don't include 3rd-layer
    // blocks.
    var entity_left_side = this.x_pos;
    var entity_right_side = this.x_pos + this.wide;
    var entity_under_side = this.y_pos;
    var entity_centre = (entity_left_side + entity_right_side) / 2;

    for(var i = 0; i < all_blocks.length; i++){

      var this_block = all_blocks[i];

      var block_left_side = this_block.x_pos;
      var block_right_side = this_block.x_pos + this_block.wide;
      var block_bottom_side = this_block.y_pos;
      var block_top_side = this_block.y_pos + this_block.high;

      if (entity_under_side <= block_top_side && entity_under_side > block_bottom_side) {
        if ((entity_centre > block_left_side && entity_centre < block_right_side) ||
        (entity_left_side > block_left_side && entity_left_side < block_right_side) ||
        (entity_right_side > block_left_side && entity_right_side < block_right_side)) {
          return true;
        }
      }
    }

    return false;
  }

  this.detect_collision = function(all_blocks) {
    //This looks very similar to the previous function, is there a way we can iterate over blocks
    //once rather than twice?

    //Somewhere in this function is an error. Check the repo for the way it once was.
    var entity_left_side = this.x_pos;
    var entity_right_side = this.x_pos + this.wide;
    var entity_bottom_side = this.y_pos;
    var entity_top_side = this.y_pos + this.high;

    for(var i = 0; i < all_blocks.length; i++){

      var this_block = all_blocks[i];

      var block_left_side = this_block.x_pos;
      var block_right_side = this_block.x_pos + this_block.wide;
      var block_bottom_side = this_block.y_pos;
      var block_top_side = this_block.y_pos + this_block.high;

      var block_on_left = entity_left_side > block_left_side && entity_left_side < block_right_side;
      var block_on_right = entity_right_side > block_left_side && entity_right_side < block_right_side;

      if ((block_on_left && this.direction_facing == 'left') || 
        (block_on_right && this.direction_facing == 'right')) {
        if ((entity_bottom_side >= block_bottom_side && entity_bottom_side < block_top_side) ||
        (entity_top_side < block_top_side && entity_top_side >= block_bottom_side)) {
          return true;
        }
      }
    }

    return false;
  }

}
