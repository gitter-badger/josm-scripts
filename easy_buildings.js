/*
    Easy buildings - scripts for speedup of work with buildings in JOSM.
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

function easy_cbuilding() {
    // init
    var cmd = require("josm/command");
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;
    var wb =  ds.wayBuilder;

    var ret = [];

    // create circle
    org.openstreetmap.josm.actions.CreateCircleAction().actionPerformed(null);

    // make it a building
    active_layer.apply(
        cmd.change(ds.selection.objects, {tags: {"building" : "yes"}})
    );

    ds.selection.ways[0].nodes.forEach(function(nod, nod_ind, nod_ar) {
        ret.push({"lat":nod.lat, "lon":nod.lon});
    });

    // finish way, nothing selected
    ds.selection.clearAll();

    //con.println("Circle building created.");
    return ret;
}

function batch_cbuilding() {
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;
    var buildings = [];
    for (i = 0; i < ds.selection.ways[0].nodes.length - 1; i+=2) {
        var n1 = ds.selection.ways[0].nodes[i];
        var n2 = ds.selection.ways[0].nodes[i+1];
        buildings.push([{"lat": n1.lat, "lon": n1.lon}, {"lat": n2.lat, "lon": n2.lon}]);
        ds.remove(n1.id, "node");
        ds.remove(n2.id, "node");
    }
    ds.selection.ways[0].nodes.forEach(function(nod, nod_ind, nod_ar) {
        ds.remove(nod.id, "node");
    });
    ds.selection.ways.forEach(function(way, way_ind, way_ar) {
        ds.remove(way.id, "way");
    });
    for (i = 0; i < buildings.length; i++) {
        ds.selection.add(
                ds.wayBuilder.withNodes(
                    ds.nodeBuilder.withPosition(buildings[i][0].lat, buildings[i][0].lon).create(),
                    ds.nodeBuilder.withPosition(buildings[i][1].lat, buildings[i][1].lon).create()).create());
        easy_cbuilding();
    }
}

function easy_obuilding() {
    // init
    var cmd = require("josm/command");
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;
    var wb =  ds.wayBuilder;
    var nb =  ds.nodeBuilder;

    var b = ds.selection.ways[0].firstNode();
    var e = ds.selection.ways[0].lastNode();

    var ret = [];

    if ((b.lat == e.lat) && (e.lon == b.lon)) {  // the way is finished
        // just orthogonalize
    } else if (ds.selection.ways[0].nodes.length == 4) { // four nodes
        // finish the way
        ds.selection.add(wb.withNodes(e, b).create());
        org.openstreetmap.josm.actions.CombineWayAction().actionPerformed(null);
    } else if (ds.selection.ways[0].nodes.length == 3) { // three nodes
        var m = ds.selection.ways[0].nodes[1];
        var zx = (b.lat + e.lat) / 2;
        var zy = (b.lon + e.lon) / 2;
        var xx = 2*zx - m.lat;
        var xy = 2*zy - m.lon;

        var x = nb.withPosition(xx, xy).create();
        ds.selection.add(wb.withNodes(e, x).create());
        ds.selection.add(wb.withNodes(x, b).create());
        org.openstreetmap.josm.actions.CombineWayAction().actionPerformed(null);
    } else {
      // TODO alert
    }

    org.openstreetmap.josm.actions.OrthogonalizeAction().actionPerformed(null);

    // tag as building
    active_layer.apply(
        cmd.change(ds.selection.objects, {tags: {"building" : "yes"}})
    );

    ds.selection.ways[0].nodes.forEach(function(nod, nod_ind, nod_ar) {
        ret.push({"lat":nod.lat, "lon":nod.lon});
    });

    // clear selection
    ds.selection.clearAll();

    //con.println("Orthogonal building created.");
    return ret;
}

function batch_obuilding() {
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;
    var buildings = [];
    var one_building = false;
    if (ds.selection.ways[0].nodes.length <= 4) {
        easy_obuilding();
        one_building = true;
    }
    if (one_building) return;
    for (i = 0; i < ds.selection.ways[0].nodes.length - 2; i+=3) {
        var n1 = ds.selection.ways[0].nodes[i];
        var n2 = ds.selection.ways[0].nodes[i+1];
        var n3 = ds.selection.ways[0].nodes[i+2];
        buildings.push([
                {"lat": n1.lat, "lon": n1.lon},
                {"lat": n2.lat, "lon": n2.lon},
                {"lat": n3.lat, "lon": n3.lon}]);
        ds.remove(n1.id, "node");
        ds.remove(n2.id, "node");
        ds.remove(n3.id, "node");
    }
    ds.selection.ways[0].nodes.forEach(function(nod, nod_ind, nod_ar) {
        ds.remove(nod.id, "node");
    });
    ds.selection.ways.forEach(function(way, way_ind, way_ar) {
        ds.remove(way.id, "way");
    });
    for (i = 0; i < buildings.length; i++) {
        ds.selection.add(
                ds.wayBuilder.withNodes(
                    ds.nodeBuilder.withPosition(buildings[i][0].lat, buildings[i][0].lon).create(),
                    ds.nodeBuilder.withPosition(buildings[i][1].lat, buildings[i][1].lon).create(),
                    ds.nodeBuilder.withPosition(buildings[i][2].lat, buildings[i][2].lon).create()).create());
        easy_obuilding();
    }
}

function easy_rarea() {
    // init
    var cmd = require("josm/command");
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;
    var wb =  ds.wayBuilder;

    // the way is not finished?
    if (
            (ds.selection.ways[0].lastNode().lat != ds.selection.ways[0].firstNode().lat) &&
            (ds.selection.ways[0].lastNode().lon != ds.selection.ways[0].firstNode().lon)
            ) {
        // finish it
        last = wb.withNodes(ds.selection.ways[0].lastNode(), ds.selection.ways[0].firstNode()).create();
        ds.selection.add(last);

        org.openstreetmap.josm.actions.CombineWayAction().actionPerformed(null);
    }

    // tag as residential area
    active_layer.apply(
        cmd.change(ds.selection.objects, {tags: {"landuse" : "residential"}})
    );

    // clear selection
    ds.selection.clearAll();

    //con.println("Residential area created.");
}

// create menu entries
var JSAction = require("josm/ui/menu").JSAction;

// create easy circle building menu entry
var create_easy_cbuilding = new JSAction({
    name: "Easy Circle Building",
    tooltip: "Create circle building by two clicks",
    onExecute: function() {
        batch_cbuilding();
}});

// create easy orthogonal building menu entry
var create_easy_obuilding = new JSAction({
    name: "Easy Orthogonal Building",
    tooltip: "Create orthogonal building by three clicks",
    onExecute: function() {
        batch_obuilding();
}});

// create residential area menu entry
var create_easy_rarea = new JSAction({
    name: "Easy Residential Area",
    tooltip: "Create residential area by few clicks",
    onExecute: function() {
        easy_rarea();
}});
