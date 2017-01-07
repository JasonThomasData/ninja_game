function populate_board(objects, map_data) {
  /*
  Accept an array from a text file and for each space on that board, generate what's there. 
  ni = ninja, player
  sk = skeleton
  zo = zombie
  We need to add those to the arrays in objects{}
  */
  var lines_from_file = map_data.match(/[^\r\n]+/g);
  console.log(lines_from_file);
  var lines_bottom_first = lines_from_file.reverse();
  console.log(lines_bottom_first);
  for (var i = 0; i < lines_bottom_first.length; i++) {
    var line_single = lines_bottom_first[i];
    var line_separated = line_single.split(' ');
    for (var j = 0; j < line_separated.length; j++) {
      console.log(line_single[j]);
      if (line_separated[j] == 'ni') {
        var player = new Player(j,i);
        objects['player'] = player;
      } else if (line_separated[j] == 'sk') {
        var skeleton = new Skeleton(j,i);
        objects['enemies'].push(skeleton);
      } else if (line_separated[j] == 'zo') {
        var zombie = new Zombie(j,i);
        objects['enemies'].push(zombie);
      } else if (line_separated[j] == 'sw') {
        var skeleton_wizard = new SkeletonWizard(j,i);
        objects['enemies'].push(skeleton_wizard);
      } else if (line_separated[j] == 'w1') {
        var wall_one = new WallOne(j,i);
        objects['blocks'].push(wall_one);
      } else if (line_separated[j] == 'w2') {
        var wall_two = new WallTwo(j,i);
        objects['blocks'].push(wall_two);
      } else if (line_separated[j] == 'g1') {
        var ground_one = new GroundOne(j,i);
        objects['blocks'].push(ground_one);
      } else if (line_separated[j] == 'g2') {
        var ground_two = new GroundTwo(j,i);
        objects['blocks'].push(ground_two);
      } else if (line_separated[j] == 'g3') {
        var ground_three = new GroundThree(j,i);
        objects['blocks'].push(ground_three);
      }
    }
  }
}

function load_map(map_location, map_name, objects) {
  /*
  It would seem nicer to call the populate_board function from the js/main.js file, but this function
  is asyncronous, so it can't reliably return any result.
  */
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var map_data = xhttp.responseText;
      populate_board(objects, map_data);
      console.log('Loading map');
      console.log(objects, map_data);
    }
  };
  var file_path = map_location + map_name;
  xhttp.open("GET", file_path, true);
  xhttp.send();
}

function get_query_string() {
    var url = window.location.href;
    var query = url.split('?')
    return query[1]
}