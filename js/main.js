var Game = function() {
  this.player_entity = new Player();
  this.enemies_all = [];

  var one_platform = new Platform(1,1);
  var two_platform = new Platform(2,0);
  var three_platform = new Platform(3,0);
  this.all_platforms = [one_platform, two_platform, three_platform];
  this.canvas = document.getElementById('drawing_board');
  this.canvas.width = game_settings.animation.frame.width;
  this.canvas.height = game_settings.animation.frame.height;
  this.ctx = this.canvas.getContext("2d");

  this.game_update = function() {
    this.player_entity.update(this.all_platforms);
    for (var i = 0; i < this.enemies_all.length; i++) {
      this.enemies_all[i].update(this.all_platforms);
    }
  }

  this.draw_shape = function(object, colour) {
    //The canvas draws from top left, but we count from bottom left
    var x_pos = object.x_pos;
    var y_pos = (game_settings.animation.frame.height - object.high) - object.y_pos;
    this.ctx.beginPath();
    this.ctx.rect(x_pos, y_pos, object.wide, object.high);
    this.ctx.fillStyle = colour;
    this.ctx.fill();
  }

  this.game_render = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //Draw player
    this.draw_shape(this.player_entity, '#000')
    for (var i = 0; i < this.all_platforms.length; i++) {
      var one_platform = this.all_platforms[i];
      this.draw_shape(one_platform, '#669900')
    }
  }
}

var current_game = new Game();

function game_loop() {
  current_game.game_update();
  current_game.game_render();
  requestAnimationFrame(game_loop);
}
game_loop()
