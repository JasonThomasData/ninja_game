/*
Since we only need background to draw, we can count its position from top left, which is where it's
drawn from on canvas.
*/

var Scenery = function(){
  this.wide = game_settings.game_environment.scenery.wide;
  this.high = game_settings.game_environment.scenery.high;
  this.sprite_sheet = new Image();
  this.sprite_source_x = 0;
  this.sprite_source_y = 0;
  this.sprite_source_height = game_settings.sprite.scenery.source_high;
  this.sprite_source_width = game_settings.sprite.scenery.source_wide;
}

var Background = function() {
  Scenery.call(this);
  this.x_pos = 0;
  this.y_pos = 50;
  this.sprite_sheet.src = 'css/sprites/scenery/background.png';
}

var Middleground = function() {
  Scenery.call(this);
  this.x_pos = 0;
  this.y_pos = 160;
  this.sprite_sheet.src = 'css/sprites/scenery/middleground.png';
}

