//Things in the foreground that are not player or enemy objects.

var Block = function(starting_x_pos, starting_y_pos){
  this.wide = game_settings.game_environment.objects.blocks.wide;
  this.high = game_settings.game_environment.objects.blocks.high;
  this.x_pos = starting_x_pos * game_settings.game_init.positions.wide;
  this.y_pos = starting_y_pos * game_settings.game_init.positions.high;
  this.sprite_sheet = new Image();
  this.sprite_sheet.src = 'css/sprites/environment/block.png';
  this.sprite_source_height = game_settings.sprite.objects.blocks.source_high;
  this.sprite_source_width = game_settings.sprite.objects.blocks.source_wide;
}

var GroundOne = function(starting_x_pos, starting_y_pos) {
  Block.call(this, starting_x_pos, starting_y_pos);
  this.sprite_source_x = 0;
  this.sprite_source_y = 0;
}

var GroundTwo = function(starting_x_pos, starting_y_pos) {
  Block.call(this, starting_x_pos, starting_y_pos);
  this.sprite_source_x = 20;
  this.sprite_source_y = 0;
}

var GroundThree = function(starting_x_pos, starting_y_pos) {
  Block.call(this, starting_x_pos, starting_y_pos);
  this.sprite_source_x = 0;
  this.sprite_source_y = 20;
}

var WallOne = function(starting_x_pos, starting_y_pos) {
  Block.call(this, starting_x_pos, starting_y_pos);
  this.sprite_source_x = 20;
  this.sprite_source_y = 20;
}

var WallTwo = function(starting_x_pos, starting_y_pos) {
  Block.call(this, starting_x_pos, starting_y_pos);
  this.sprite_source_x = 0;
  this.sprite_source_y = 40;
}
