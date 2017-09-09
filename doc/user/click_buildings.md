# Click buildings
Go back to [README](../../README.md).

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

