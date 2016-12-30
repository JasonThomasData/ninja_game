var Block = function(starting_x_pos, starting_y_pos){
  this.wide = game_settings.objects.blocks.wide;
  this.high = game_settings.objects.blocks.high;
  this.x_pos = starting_x_pos * game_settings.positions.wide;
  this.y_pos = starting_y_pos * game_settings.positions.high;
  this.sprite_sheet = new Image();
  this.sprite_sheet.src = 'css/sprites/block.png';
  this.sprite_source_height = 20;
  this.sprite_source_width = 20;
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
