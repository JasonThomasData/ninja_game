document.addEventListener('keydown', function(event) {
  if (event.which == game_settings.controls.up_move.code_number){
    current_game.player_entity.jump_order();
  } else if (event.which == game_settings.controls.left_move.code_number){
    current_game.player_entity.move_order('left');
  } else if (event.which == game_settings.controls.right_move.code_number){
    current_game.player_entity.move_order('right');
  } else if (event.which == game_settings.controls.down_move.code_number){
    current_game.player_entity.stop_order();
  }
}, false);