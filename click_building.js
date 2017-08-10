/*
    Click building - create building by one click.
    Copyright (C) 2017  Jiri Hubacek
    Contact: Jiri Hubacek <jiri.hubacek@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// for debug purposes
//var con = require("josm/scriptingconsole");
//con.clear();

/*// general includes
var JSAction = require("josm/ui/menu").JSAction;

// create click building
var click_building = new JSAction({
    name: "Easy Click Building",
    tooltip: "Create click building",
    onExecute: function() {
        // init
        var cmd = require("josm/command");
        var active_layer = josm.layers.activeLayer;
        var ds = active_layer.data;
        var wb =  ds.wayBuilder;

        // source code here
        // ...
}});*/

var con = require("josm/scriptingconsole");
con.clear();

var active_layer = josm.layers.activeLayer;
var ds = active_layer.data;
var n = ds.selection.nodes[0];

var il = org.openstreetmap.josm.gui.layer.ImageryLayer;
var tmsl = org.openstreetmap.josm.gui.layer.TMSLayer;

if (josm.layers.get(1) instanceof tmsl) {
  //con.print(josm.layers.get(1).img);
  con.print("yes\n");
}

var ts = josm.layers.get(1).getTileSourceStatic(josm.layers.get(1).info);
con.print(ts);
con.print("\n");
con.print(josm.layers.get(1).class);
con.print("\n");
con.print(josm.layers.length);

// Tile: https://josm.openstreetmap.de/doc/org/openstreetmap/gui/jmapviewer/Tile.html
tile = new org.openstreetmap.gui.jmapviewer.Tile(ts, 271098, 247050, 19);
con.print("\n");

// BufferedImage: http://docs.oracle.com/javase/8/docs/api/java/awt/image/BufferedImage.html
con.print(tile.image);
