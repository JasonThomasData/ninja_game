/*
A note on the positions - these are the starting locations for the maps. These are used for placing objects, and don't get used after that.
A player's starting location might be x=2, and with a position width of 40, then the unit's x_pos after
init would be 80. This allows the game's objects to remain a consistent size, and will allow drawing worlds
from ascii maps in text files.
A sprite's actual width is 26 pixels, although 6 of that is for extending weapons. The width of an object where it stands is 20 pixels.
*/

var game_settings = {
  game: {
    maps_folder: 'maps/'
  },
  positions: {
    wide: 60,
    high: 60
  },
  sprite: {
    weapon_offset: 6,
    entity: {
      source_wide: 26,
      source_high: 31,
    },
    object: {
      source_wide: 20,
      source_high: 20
    }
  },
  entity: {
    wide: 60,
    high: 90,
    y_fall_speed_px: 1,
    attack_duration: 9
  },
  player: {
    starting_hp: 100,
    px_per_move_x: 60,
    px_jump_force_y: 15,
    x_move_speed_px: 3
  },
  enemies: {
    starting_hp: 50,
    px_per_move_x: 60,
    px_jump_force_y: 13,
    x_move_speed_px: 1
  },
  objects: {
    blocks: {
      wide: 60,
      high: 60
    }
  },
  animation: {
    frame: {
      width: 900,
      height: 600,
      centre: {
        x: 450,
        y: 300
      }
    },
    target_fps: 15
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
    attack: {
      key: 'space',
      code_number: 32
    }
  }
}
