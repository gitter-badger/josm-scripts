# Easy buildings user documentation
Go back to [README](../../README.md).

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
* Another two nodes at multiple buildings diameters can be selected.
* Run shortcut.

It has the following effect:
* Circle buildings are created with selected nodes positions.
* Next mode is *Draw nodes (A)*

## Easy Orthogonal Building
* The user needs to be in *Draw nodes (A)* mode.
* Select three (four) nodes on building corners.
* If three nodes used, another three nodes at multiple buildings corners can be
  selected.
* Run shortcut.

It has the following effect:
* Orthogonal buildings are created with selected nodes positions.
* Next mode is *Draw nodes (A)*

## Easy Residential Area
* The user needs to be in *Draw nodes (A)* mode.
* Select multiple nodes bordering a residential area.
* Run shortcut.

It has the following effect:
* The way is closed.
* Nodes are tagged as `landuse : residential`.
* Next mode is *Draw nodes (A)*
