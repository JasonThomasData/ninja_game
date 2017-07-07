Note - if you're looking at my Github profile, I'm no longer working on this. I've learned a lot
about OOP since starting this project and it would need a large refactor and restructure.

This is a fun game where a ninja has to fight zombies, skeletons and other creatures. It started
after I decided to do some pixel art one day and I got a little obsessed.

It's actually turned into a real project that is a lot of fun to play. To play it, you'll need
to make the site available with a local server. Use this url - ```localhost/runningGame?first```.
The ```first``` at the end is the name of the map that will be loaded.

Here's some gifs of enemies I've made so far.

![zombie_gif](/demo/zombie.gif)
![skeleton_gif](/demo/skeleton.gif)
![skeleton_wizard_gif](/demo/skeleton_wizard_right.gif)

### Creating a map

This project will read text files and create levels that way. Save a level like this:

    .. .. .. .. .. ..
    ni .. .. sk zo w1
    g1 g1 g1 g1 g1 w2
    g2 g2 g2 g2 g2 w2
    g3 g3 g3 g3 g3 g3

The double dots are just spaces, and you could replace those with whatever you feel like. The other
squares are references to objects. These translate as:

##### Entities

    ni - ninja/player. There should only be one of these.
    sk - skeleton. The most basic enemy, but can also be reborn from other dead creatures.
    zo - zombie. More hurtful and more HP than the skeleton.

##### Blocks/objects

    g1 - ground, top level, grassy
    g2 - ground, second level, different texture
    g3 - ground, third level, all other ground should be this consistent texture.
    w1 - wall, top level, slightly brighter than others
    w2 - wall, second level, darker

It would be super fun the make the boss of this game Vladimir Putin, and have the minor boss Donald
Trump or something. Trump could throw his wig as a returning projectile. Putin could fire bullets
out of his nipples, perhaps, or have a jetpack in his bum, or something tough like that.

### Project structure

The game's logic and animation loop exists in the ```js/main.js``` file. That needs to be
modified to keep the update speed at a constant rate, so no more than x per second for any
client. Slow machines might just have to be slow, unless the animation happens every n
frames with the logic continuing regardless.

Drawing the entities involves two opposing sets of sprites for each character - one
facing left, one right. The reason is, it's a relative pain to swap the canvas context to
draw something mirror-image, and it's easier to have a mirrored sprite sheet for that.
Animation is made possible with a script called the entity object for animation, which each
entity inherits. Based on the entity state, it will show a new sprite. Each "state" is also a key
in a file called ```js/sprite_map.js```, which has the top-left coordinates for each animation,
and there's one for each entity.

The process for vertical and horizontal movement, which are different of course, are also
inherited into the entity object.

A particularly import thing to note is the ```js/game_init.js``` file, which is responsible
for loading a file, getting all text, and then draing the map with that. In the ```js/settings.js``` 
file there is a property called "positions". These positions are the width of a position on the game
canvas, which is needed to make use of text files for level creation.

The ```js/settings.js``` should be the single place to control the game actually, as all
objects and entities get their initial values from there - fall speed, movement speed, hit
points - etc are all defined in the settings file.

I'm not sold yet on having the entities' functions to move them as member functions of those
objects, and maybe a separate ```entity_actions.js``` would help to keep the code base nice
and manageble - like just a file with functiond defined, perhaps.

There's a bunch of stuff to do, like creating a condition to only draw shapes that are going
to appear on the canvas (which is only so-wide), giving the monsters some logic skills, giving
weapon hits some meaning (no damage yet). Also, consider improvements to collission detection.
So for example, if a projectile can only move horizontally, then once the projectile is fired,
it will be able to check which obstacles (which don't move) it can hit, and check collissions
with that short list. Similar thing for entities - if an enemy is behind the projectile when
it is fired, you won't need to check a collission with that object again. Similar optimisations
can be made for all collission detection.

I've tried to document the code with comments in the code itself, and tests. I probably
should write some more tests.
