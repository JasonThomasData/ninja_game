var Platform = function(starting_x_pos, starting_y_pos){
  this.wide = game_settings.objects.platforms.wide;
  this.high = game_settings.objects.platforms.high;
  this.x_pos = starting_x_pos * game_settings.positions.wide;
  this.y_pos = starting_y_pos * game_settings.positions.high;
}