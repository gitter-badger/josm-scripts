JOSM scripts
============
Some useful scripts for [JOSM Scripting
Plugin](http://gubaer.github.io/josm-scripting-plugin/)
([source code](https://github.com/Gubaer/josm-scripting-plugin)).

For installation of scripting plugin, please see [JOSM scripting plugin
installation](https://github.com/Gubaer/josm-scripting-plugin#for-josm-users).

Easy buildings
==============
This script can be run as follows:

1. Download the script.
2. Select Scripting -> Run.
3. Search for downloaded script.
4. Run it.

Note: The script needs to be run every time JOSM is restarted.

This script creates three new actions that are intended to be mapped to
shortcuts as follows:

1. Edit -> Preferences.
2. Changing keyboard shortcuts manually.
3. Search: easy.
4. Add shortcuts to actions.

Note: Recommendation is to use shortcuts accessible by no-mouse hand.
Note: Shortcuts assignment persist the restart of JOSM.

Easy Circle Building
--------------------
* The user needs to be in *Draw nodes (A)* mode.
* Select two nodes on a building diameter.
* Run shortcut.

It has the following effect:
* Circle is created, way is closed.
* Nodes are tagged as `building : yes`.
* Next mode is *Draw nodes (A)*

Easy Orthogonal Building
------------------------
* The user needs to be in *Draw nodes (A)* mode.
* Select three (four) nodes on building corners.
* Run shortcut.

It has the following effect:
* Orthogonal way is created and closed.
* Nodes are tagged as `building : yes`.
* Next mode is *Draw nodes (A)*

Easy Residential Area
---------------------
* The user needs to be in *Draw nodes (A)* mode.
* Select multiple nodes bordering a residential area.
* Run shortcut.

It has the following effect:
* The way is closed.
* Nodes are tagged as `landuse : residential`.
* Next mode is *Draw nodes (A)*
