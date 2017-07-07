//Some code - here - displays how touch handling can be achieved with JS

document.addEventListener('keypress', function(event) {
  event.preventDefault();
  var player = current_game.objects['player'];
  if (event.which == game_settings.controls.left_move.code_number){
    player.move_order('left');
  } else if (event.which == game_settings.controls.right_move.code_number){
    player.move_order('right');
  } else if (event.which == game_settings.controls.up_move.code_number){
    player.jump_order();
  } else if (event.which == game_settings.controls.down_move.code_number){
    player.stop_order();
  } else if (event.which == game_settings.controls.meelee_attack.code_number){
    player.meelee_attack_order();
  } else if (event.which == game_settings.controls.throw_attack.code_number){
    player.projectile_attack_order();
  }
}, false);

window.addEventListener('resize', function(event) {
  var inner_width = window.innerWidth;
  var inner_height = window.innerHeight;
  var window_aspect_ratio = inner_width / inner_height;
  var target_aspect_ratio = game_settings.animation.frame.width / game_settings.animation.frame.height;

  if (window_aspect_ratio < target_aspect_ratio) {
    var display_width = inner_width * 0.95;
    var display_height = display_width / target_aspect_ratio;
  } else {
    var display_height = inner_height * 0.95;
    var display_width = display_height * target_aspect_ratio;
  }

  document.getElementById('drawing_board').style.width = display_width + 'px';
  document.getElementById('drawing_board').style.height = display_height + 'px';
});

