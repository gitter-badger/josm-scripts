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

    Credits: It's me.

    This was the first attempt to deal with my laziness. More than a few
    clicks and one shortcut keypress is no way. BuildingsTools make the job
    for square buildings but not for circle (and I do not copy + resize them
    because for me it's too heavy too) nor for residential areas.
*/

// for debug purposes
//var con = require("josm/scriptingconsole");

// general includes
var JSAction = require("josm/ui/menu").JSAction;

// create circle building
var cbuilding = new JSAction({
    name: "Easy Circle Building",
    tooltip: "Create easy circle building",
    onExecute: function() {
        // init
        var cmd = require("josm/command");
        var active_layer = josm.layers.activeLayer;
        var ds = active_layer.data;
        var wb =  ds.wayBuilder;

        // create circle
        org.openstreetmap.josm.actions.CreateCircleAction().actionPerformed(null);

        // make it a building
        active_layer.apply(
            cmd.change(ds.selection.objects, {tags: {"building" : "yes"}})
        );

        // finish way, nothing selected
        ds.selection.clearAll();

        //con.println("Circle building created.");
}});

// create orthogonal building
var obuilding = new JSAction({
    name: "Easy Orthogonal Building",
    tooltip: "Create easy orthogonal building",
    onExecute: function() {
        // init
        var cmd = require("josm/command");
        var active_layer = josm.layers.activeLayer;
        var ds = active_layer.data;
        var wb =  ds.wayBuilder;
        var nb =  ds.nodeBuilder;

        var b = ds.selection.ways[0].firstNode();
        var e = ds.selection.ways[0].lastNode();

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

        // clear selection
        ds.selection.clearAll();

        //con.println("Orthogonal building created.");
}});

// create residential area
var rarea = new JSAction({
    name: "Easy Residential Area",
    tooltip: "Create easy residential area",
    onExecute: function() {
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
}});
