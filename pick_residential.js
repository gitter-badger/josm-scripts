/*
    Pick residential - create residential area around selected buildings.
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

// Graham scan implementation
// @see https://en.wikipedia.org/wiki/Graham_scan
function ccw(p1, p2, p3)
{
    return (p2["lon"] - p1["lon"])*(p3["lat"] - p1["lat"]) - 
        (p2["lat"] - p1["lat"])*(p3["lon"] - p1["lon"]);
}

function graham_scan(coords)
{
    n_min = coords[0], n_min_i=0;
    m = 0;

    for (n in coords) {
        if (coords[n]["lat"] < n_min["lat"]) {
            n_min = coords[n];
            n_min_i = n;
        }
    }

    coords[n_min_i] = coords[0];
    coords[0] = n_min;

    coords.sort(function(a, b){
        d_alat = a["lat"] - coords[0]["lat"];
        d_alon = a["lon"] - coords[0]["lon"];

        d_blat = b["lat"] - coords[0]["lat"];
        d_blon = b["lon"] - coords[0]["lon"];

        // @see https://en.wikipedia.org/wiki/Polar_coordinate_system
        return Math.atan2(d_alat, d_alon) - Math.atan2(d_blat, d_blon);
    });

    coords[-1] = coords[coords.length - 1];

    for (i = 1; i < coords.length; i++) {
        while (ccw(coords[m - 1], coords[m], coords[i]) <= 0) {
            if (m>1) {
                m -= 1;
                continue;
            } else if (i == coords.length - 1) {
                break;
            } else {
                i += 1;
            }
        }

        m += 1;
        n_min = coords[m];
        coords[m] = coords[i];
        coords[i] = n_min;
    }

    return coords.slice(0, m+1);
}

function create_border(b_orig) {
    var cmd = require("josm/command");
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;
    var wb = ds.wayBuilder;
    var nb = ds.nodeBuilder;
    var border = [];

    b_orig.forEach(function(nod, nod_ind, nod_ar) {
        border.push(nb.withPosition(nod["lat"], nod["lon"]).create());
    });

    ds.selection.add(wb.withNodes(border[0], border[1]).create());
    for (i = 2; i < border.length; i++) {
        ds.selection.add(wb.withNodes(border[i-1], border[i]).create());
        org.openstreetmap.josm.actions.CombineWayAction().actionPerformed(null);
    }
    ds.selection.add(wb.withNodes(border[border.length - 1], border[0]).create());
    org.openstreetmap.josm.actions.CombineWayAction().actionPerformed(null);

    active_layer.apply(
            cmd.change(
                ds.selection.objects,
                {tags: {"landuse" : "residential"}}));
}

function find_ltrb(nodes) {
    var ltrb = [];
    ltrb.push(nodes[0]["lon"]);
    ltrb.push(nodes[0]["lat"]);
    ltrb.push(nodes[0]["lon"]);
    ltrb.push(nodes[0]["lat"]);

    nodes.forEach(function(nod, nod_ind, nod_ar) {
        if (nod["lon"] < ltrb[0]) ltrb[0] = nod["lon"];
        if (nod["lat"] < ltrb[1]) ltrb[1] = nod["lat"];
        if (nod["lon"] > ltrb[2]) ltrb[2] = nod["lon"];
        if (nod["lat"] > ltrb[3]) ltrb[3] = nod["lat"];
    });
    return ltrb;
}

function pick_rarea() {
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;
    var nb = ds.nodeBuilder;
    var b_nodes = [];
    var coords = [];
    ds.selection.ways.forEach(function(way, way_ind, way_ar) {
        coords = find_ltrb(way.nodes);
        b_nodes.push(nb.withPosition(coords[1]-0.00006, coords[0]-0.00006).create());
        b_nodes.push(nb.withPosition(coords[3]+0.00006, coords[2]+0.00006).create());
        b_nodes.push(nb.withPosition(coords[1]-0.00006, coords[2]+0.00006).create());
        b_nodes.push(nb.withPosition(coords[3]+0.00006, coords[0]-0.00006).create());
    });
    var b_orig = graham_scan(b_nodes);
    b_nodes.forEach(function(nod, nod_ind, nod_ar) {
        ds.remove(nod.id, "node");
    });
    ds.selection.clearAll();
    create_border(b_orig);
    ds.selection.clearAll();
}

// create menu entries
var JSAction = require("josm/ui/menu").JSAction;

// create pick residential area menu entry
var create_pick_rarea = new JSAction({
    name: "Pick Residential",
    tooltip: "Automatically create residential area around selection",
    onExecute: function() {
        pick_rarea();
}});
