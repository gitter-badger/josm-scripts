# JOSM scripts
Some useful scripts for [JOSM Scripting Plugin]. For installation of JOSM
Scripting Plugin see [installation].

[JOSM Scripting Plugin]: http://gubaer.github.io/josm-scripting-plugin/
[installation]: https://github.com/Gubaer/josm-scripting-plugin#for-josm-users

For short notes about history of ideas see [credits].

[credits]: ./doc/credits.md

# Click buildings
This script can be run as follows:

1. Download the script.
2. Select Scripting -> Run.
3. Search for downloaded script.
4. Run it.

Note: The script needs to be run every time JOSM is restarted.

This script creates one new action that is intended to be mapped to
shortcut as follows:

1. Edit -> Preferences.
2. Changing keyboard shortcuts manually.
3. Search: click.
4. Add shortcut to action.

Note: Recommendation is to use shortcuts accessible by no-mouse hand.
Note: Shortcuts assignment persist the restart of JOSM.
IMPORTANT: This script is dependent on *Easy buildings* script.

## Click Circle Building
* The user needs to be in *Draw nodes (A)* mode.
* Select one node in the middle of a building.
* Run shortcut.

It has the following effect:
* Circle is created around the building.
* Nodes are tagged as `building : yes`.
* Next mode is *Draw nodes (A)*


# Easy autoresidential
This script can be run as follows:

1. Download the script.
2. Select Scripting -> Run.
3. Search for downloaded script.
4. Run it.

Note: The script needs to be run every time JOSM is restarted.

This script creates new actions that is intended to be mapped to shortcuts as
follows:

1. Edit -> Preferences.
2. Changing keyboard shortcuts manually.
3. Search: easy.
4. Add shortcuts to actions.

Note: Recommendation is to use shortcuts accessible by no-mouse hand.
Note: Shortcuts assignment persist the restart of JOSM.

## Easy Autoresidential
* The user needs to be in *Select, move, scale and rotate objects (S)* mode.
* Select buildings of residential area.
* Run shortcut.

It has the following effect:
* Residential area around buildings is created.
* Next mode is *Select, move, scale and rotate objects (S)*.


# Easy buildings
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

## Easy Circle Building
* The user needs to be in *Draw nodes (A)* mode.
* Select two nodes on a building diameter.
* Run shortcut.

It has the following effect:
* Circle is created, way is closed.
* Nodes are tagged as `building : yes`.
* Next mode is *Draw nodes (A)*

## Easy Orthogonal Building
* The user needs to be in *Draw nodes (A)* mode.
* Select three (four) nodes on building corners.
* Run shortcut.

It has the following effect:
* Orthogonal way is created and closed.
* Nodes are tagged as `building : yes`.
* Next mode is *Draw nodes (A)*

## Easy Residential Area
* The user needs to be in *Draw nodes (A)* mode.
* Select multiple nodes bordering a residential area.
* Run shortcut.

It has the following effect:
* The way is closed.
* Nodes are tagged as `landuse : residential`.
* Next mode is *Draw nodes (A)*
