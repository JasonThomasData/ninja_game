//A note on the positions - these are the starting locations for the maps. These are used for placing objects, and don't get used after that.
//A player's starting location might be x=1, and with a position width of 100, then the unit's x_pos after
//init would be 100. This allows the game's objects to remain a consistent size, and will allow drawing worlds
//from simple text files.

var game_settings = {
  positions: {
    wide: 100,
    high: 100
  },
  player: {
    starting_hp: 100,
    wide: 100,
    high: 100,
    starting_x_pos: 0,
    starting_y_pos: 0,
    px_per_move_x: 100,
    px_per_jump_y: 100
  },
  enemies: {
    starting_hp: 50,
    px_per_move_x: 50,
    px_per_jump_y: 100
  },
  objects: {
    platforms: {
      wide: 100,
      high: 100
    }
  },
  animation: {
    frame: {
      width: 500,
      height: 300
    },
    target_fps: 15
  }
}