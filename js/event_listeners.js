document.addEventListener('keypress', function(event) {
  var player = current_game.objects['player'];
  if (event.which == game_settings.controls.left_move.code_number){
    player.move_order('left');
  } else if (event.which == game_settings.controls.right_move.code_number){
    player.move_order('right');
  } else if (event.which == game_settings.controls.up_move.code_number){
    player.jump_order();
  } else if (event.which == game_settings.controls.down_move.code_number){
    player.stop_order();
  } else if (event.which == game_settings.controls.attack.code_number){
    player.attack_order();
  }
}, false);
