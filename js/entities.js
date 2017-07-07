/* 
An entity is a player or enemy, which move, attack and have animated sprites associated with
them. The player class contains the necessary functions to make the player object move.
The update() function is the function the main game loop will call, and all changes are made from
there or from functions called from update().
*/

var Entity = function(px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos,
  attack_duration, throw_attack_height) {
  EntityHorizontalMovement.call(this, px_per_move_x, x_move_speed_px);
  EntityVerticalMovement.call(this, px_jump_force_y);
  EntityPhysicalBeing.call(this, starting_x_pos, starting_y_pos, attack_duration, throw_attack_height);

  this.update = function(all_blocks){
    // Call from main loop. Control the entity. This is not the logic unit that tells the unit what
    // to do, but the function that completes the entity's turn in the game.

    var sprite_changed = false

    //Update vertically

    this.check_block_underneath(all_blocks);

    if (!this.block_underneath && this.vertical_movement_px <= 0) {
      this.falling = true;
    }

    if (this.block_underneath && this.falling) {
      //The entity was falling but has landed on something, so make sure it is on top of the
      //Check EntityVerticalMovement()
      this.place_top_of_block();
      this.stop_falling();
    }

    if (this.vertical_movement_px > 0) {
      this.update_sprite(this.direction_facing, 'jump');
      this.move_y();
      sprite_changed = true;
    } else if (this.falling) {
      this.update_sprite(this.direction_facing, 'fall');
      this.move_y();
      sprite_changed = true;
    }

    //Update Horizontally

    var collision_detected = this.check_collision(all_blocks);

    if (collision_detected == true) {
      // The entity was moving sideways but has hit something, stop moving
      // Check EntityHorizontalMovement()

      this.place_side_of_block();
      this.stop_x_move();
    }

    if (this.px_x_move_remaining > 0) {
      // The entity is either falling, jumping or running.
      // Check EntityHorizontalMovement()
      // Move sprite change to here.
      this.move_x();
      sprite_changed = true;
    }

    //Attack

    if (this.meelee_attacking) {
      if (this.block_underneath) {
        this.stop_x_move();
      }
      this.continue_attack();
      if (this.attacking_for >= this.attack_duration) {
        this.end_attack();
      } else {
        this.update_sprite(this.direction_facing, 'meelee_attack');
        sprite_changed = true;
      }
    } else if (this.projectile_attacking) {
      // Some duplication here, can this be made more abstract?
      if (this.block_underneath) {
        this.stop_x_move();
      }
      this.continue_attack();
      if (this.attacking_for >= this.attack_duration) {
        this.end_attack();
      } else {
        this.update_sprite(this.direction_facing, 'projectile_attack');
        sprite_changed = true;
      }
    }

    if (sprite_changed == false) {
      this.update_sprite(this.direction_facing, 'still');
    }
  }

}

var Player = function(starting_x_pos, starting_y_pos) {
  //This is our basic player object - inherits from the Entity class

  var px_per_move_x = game_settings.game_environment.player.px_per_move_x;
  var px_jump_force_y = game_settings.game_environment.player.px_jump_force_y;
  var x_move_speed_px = game_settings.game_environment.player.x_move_speed_px;
  var attack_duration = game_settings.game_environment.player.attack_duration;
  var throw_attack_height = 48;
  Entity.call(this, px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos,
    attack_duration, throw_attack_height);

  var sprite_sheet_left = 'css/sprites/entities/ninja_left.png';
  var sprite_sheet_right = 'css/sprites/entities/ninja_right.png';
  var ninja_sprite_map = sprite_map.ninja;
  var meelee_attack_frames_number = ninja_sprite_map.meelee_attack.length;
  var projectile_attack_frames_number = ninja_sprite_map.projectile_attack.length;
  var death_frames_number = ninja_sprite_map.die.length;
  var step_frames_number = ninja_sprite_map.step.length;
  EntityAnimation.call(this, sprite_sheet_left, sprite_sheet_right, ninja_sprite_map,
    meelee_attack_frames_number, projectile_attack_frames_number, death_frames_number,
    step_frames_number);

  this.move_order = function(direction) {
    //If order to move is in the opposite direction, then the move is less (braking).
    if (!this.meelee_attacking && !this.projectile_attacking) {
      //In EntityHorizontalMovement()
      this.new_move(direction);
    }
  }
  this.jump_order = function() {
    if (this.block_underneath && !this.meelee_attacking && !this.projectile_attacking) {
      //In EntityVerticalMovement()
      this.new_jump();
    }
  }
  this.meelee_attack_order = function() {
    if (!this.meelee_attacking && !this.projectile_attacking) {
      this.new_meelee_attack();
    }
  }
  this.projectile_attack_order = function() {
    if (!this.meelee_attacking && !this.projectile_attacking) {
      this.new_projectile_attack();
    }
  }
  this.stop_order = function() {
    if (this.block_underneath && !this.meelee_attacking && !this.projectile_attacking) {
      this.stop_x_move();
    }
  }

}

var Skeleton = function(starting_x_pos, starting_y_pos) {
  var px_per_move_x = game_settings.game_environment.enemies.px_per_move_x;
  var px_jump_force_y = game_settings.game_environment.enemies.px_jump_force_y;
  var x_move_speed_px = game_settings.game_environment.enemies.x_move_speed_px;
  var attack_duration = game_settings.game_environment.enemies.attack_duration;
  var throw_attack_height = null;
  Entity.call(this, px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos,
    attack_duration, throw_attack_height);

  var sprite_sheet_left = 'css/sprites/entities/skeleton_left.png';
  var sprite_sheet_right = 'css/sprites/entities/skeleton_right.png';
  var skeleton_sprite_map = sprite_map.skeleton;
  var meelee_attack_frames_number = skeleton_sprite_map.meelee_attack.length;
  var projectile_attack_frames_number = null;
  var death_frames_number = skeleton_sprite_map.die.length;
  var step_frames_number = skeleton_sprite_map.step.length;
  EntityAnimation.call(this, sprite_sheet_left, sprite_sheet_right, skeleton_sprite_map,
    meelee_attack_frames_number, projectile_attack_frames_number, death_frames_number,
    step_frames_number);

}

var Zombie = function(starting_x_pos, starting_y_pos) {
  var px_per_move_x = game_settings.game_environment.enemies.px_per_move_x;
  var px_jump_force_y = game_settings.game_environment.enemies.px_jump_force_y;
  var x_move_speed_px = game_settings.game_environment.enemies.x_move_speed_px;
  var attack_duration = game_settings.game_environment.enemies.attack_duration;
  var throw_attack_height = null;
  Entity.call(this, px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos,
    attack_duration, throw_attack_height);

  var sprite_sheet_left = 'css/sprites/entities/zombie_left.png';
  var sprite_sheet_right = 'css/sprites/entities/zombie_right.png';
  var zombie_sprite_map = sprite_map.zombie;
  var meelee_attack_frames_number = zombie_sprite_map.meelee_attack.length;
  var projectile_attack_frames_number = null;
  var death_frames_number = zombie_sprite_map.die.length;
  var step_frames_number = zombie_sprite_map.step.length;
  EntityAnimation.call(this, sprite_sheet_left, sprite_sheet_right, zombie_sprite_map,
    meelee_attack_frames_number, projectile_attack_frames_number, death_frames_number,
    step_frames_number);

}

var SkeletonWizard = function(starting_x_pos, starting_y_pos) {
  var px_per_move_x = 20;
  var px_jump_force_y = game_settings.game_environment.player.px_jump_force_y;
  var x_move_speed_px = 0.5;
  var attack_duration = game_settings.game_environment.enemies.attack_duration;
  var throw_attack_height = 65;
  Entity.call(this, px_per_move_x, px_jump_force_y, x_move_speed_px, starting_x_pos, starting_y_pos,
    attack_duration, throw_attack_height);

  var sprite_sheet_left = 'css/sprites/entities/skeleton_wizard_left.png';
  var sprite_sheet_right = 'css/sprites/entities/skeleton_wizard_right.png';
  var skeleton_wizard_sprite_map = sprite_map.skeleton_wizard;
  var meelee_attack_frames_number = null;
  var projectile_attack_frames_number = skeleton_wizard_sprite_map.projectile_attack.length;
  var death_frames_number = 0;
  var step_frames_number = skeleton_wizard_sprite_map.step.length;
  EntityAnimation.call(this, sprite_sheet_left, sprite_sheet_right, skeleton_wizard_sprite_map,
    meelee_attack_frames_number, projectile_attack_frames_number, death_frames_number,
    step_frames_number);

}
