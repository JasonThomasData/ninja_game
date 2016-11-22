//A note on the positions - these are the starting locations for the maps. These are used for placing objects, and don't get used after that.
//A player's starting location might be x=1, and with a position width of 100, then the unit's x_pos after
//init would be 100. This allows the game's objects to remain a consistent size, and will allow drawing worlds
//from simple text files.

var game_settings = {
  positions: {
    wide: 50,
    high: 50
  },
  player: {
    starting_hp: 100,
    wide: 50,
    high: 75,
    starting_x_pos: 1,
    starting_y_pos: 4,
    px_per_move_x: 50,
    px_per_jump_y: 50
  },
  enemies: {
    starting_hp: 50,
    px_per_move_x: 50,
    px_per_jump_y: 50
  },
  objects: {
    platforms: {
      wide: 50,
      high: 50
    }
  },
  animation: {
    frame: {
      width: 700,
      height: 500
    },
    target_fps: 15
  },
  controls: {
    up_move: {
      key: 'w',
      code_number: 87
    },
    left_move: {
      key: 'a',
      code_number: 65
    },
    right_move: {
      key: 'd',
      code_number: 68
    },
    down_move: {
      key: 's',
      code_number: 83
    }
  }
}