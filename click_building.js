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
// row 21
con.print(josm.layers.length);

con.print("\n");

var tile_xy = ts.latLonToTileXY(n.lat, n.lon, 19);
tile = new org.openstreetmap.gui.jmapviewer.Tile(ts, tile_xy.x, tile_xy.y, 19);
//tile2 = new org.openstreetmap.gui.jmapviewer.Tile(ts, tile_xy.x+1, tile_xy.y, 19);
con.print("\ntile key: "+tile.getKey());
//con.print("\ntile2 key: "+tile2.getKey());
con.print("\ntile url: "+tile.getUrl());
con.print("\ntile lat, lon: "+ts.tileXYToLatLon(tile));
//con.print("\ntile2 lat, lon: "+ts.tileXYToLatLon(tile2));
//con.print("\nlon diff: "+(ts.tileXYToLatLon(tile2).lon - ts.tileXYToLatLon(tile).lon));
con.print("\n");

// Tile width (lon): 0.0006866455078125
// Tile width (lon): -0.0006866455078125
// Tile height (lat): -0.0006755634657054088
// Tile height (lat): 0.0006755620169709431
// http://wiki.openstreetmap.org/wiki/Zoom_levels

var p = ts.latLonToXY(n.lat, n.lon, 19);
con.print("\nlat:"+n.lat+", lon:"+n.lon);
con.print("\n");
con.print("x:"+p.x+", y:"+p.y);
con.print("\n");
//con.print(tile.image.getSubimage(0, 0, 100, 100));
//con.print(tile.image.getData());
//con.print(tile.image);
con.print("getRGB: "+tile.getImage().getRGB(p.x - 256*tail_xy.x, p.y - 256*tail_xy.y));

// TODO where in tile (pixels) is node (wgs84)?
