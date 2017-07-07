/*
A note on the positions - these are the starting locations for the maps. These are used for placing objects, and don't get used after that.
A player's starting location might be x=2, and with a position width of 40, then the unit's x_pos after
init would be 80. This allows the game's objects to remain a consistent size, and will allow drawing worlds
from ascii maps in text files.
A sprite's actual width is 26 pixels, although 6 of that is for extending weapons. The width of an object where it stands is 20 pixels.

BTW, wouldn't it make sense to group things as objects and not their function? Like, put the sprite and physical attributes under each type of thing, rather than have all sprites defined in a sprite thing.
Also it would make way more sense to have the entity as a thing that contains the player and all enemies, since they do inherit from that similar class.
*/

var game_settings = {
  game_init: {
    maps_folder: 'maps/',
    positions: {
      wide: 60,
      high: 60
    }
  },
  sprite: {
    weapon_offset: 6,
    entity: {
      source_wide: 26,
      source_high: 31,
    },
    objects: {
      blocks: {
        source_wide: 20,
        source_high: 20
      },
      projectiles: {
        source_wide: 4,
        source_high: 4
      }
    },
    scenery: {
      source_wide: 150,
      source_high: 30,
    }
  },
  game_environment: {
    minimum_ms_per_game_loop: 15,
    entity: {
      weapon_offset: 18,
      wide: 60,
      high: 93,
      y_fall_speed_px: 1
    },
    player: {
      starting_hp: 100,
      px_per_move_x: 60,
      px_jump_force_y: 16,
      x_move_speed_px: 3,
      attack_duration: 12
    },
    enemies: {
      starting_hp: 50,
      px_per_move_x: 60,
      px_jump_force_y: 13,
      x_move_speed_px: 1,
      attack_duration: 32
    },
    objects: {
      blocks: {
        wide: 60,
        high: 60
      },
      projectiles: {
        wide: 12,
        high: 12,
        x_move_speed_px: 5
      }
    },
    scenery: {
      wide: 450,
      high: 90
    }
  },
  animation: {
    frame: {
      width: 600,
      height: 380,
      centre: {
        x: 300,
        y: 190
      }
    },
    max_fps: 48 //Because, reasons see - https://en.wikipedia.org/wiki/Frame_rate
  },
  controls: {
    up_move: {
      key: 'w',
      code_number: 119
    },
    left_move: {
      key: 'a',
      code_number: 97
    },
    right_move: {
      key: 'd',
      code_number: 100
    },
    down_move: {
      key: 's',
      code_number: 115
    },
    meelee_attack: {
      key: 'comma',
      code_number: 44
    },
    throw_attack: {
      key: 'full_stop',
      code_number: 46
    }
  }
}
