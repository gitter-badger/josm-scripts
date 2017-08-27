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
var con = require("josm/scriptingconsole");
con.clear();

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

var active_layer = josm.layers.activeLayer;
var ds = active_layer.data;

var lnode = ds.selection.nodes[ds.selection.nodes.length - 1];

var ts = josm.layers.get(1).getTileSourceStatic(josm.layers.get(1).info);
var act_tile_xy = ts.latLonToTileXY(lnode.lat, lnode.lon, 19);

act_tile = new org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y, 19);
tmp_tile = new org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x+1, act_tile_xy.y, 19);
var pw = (ts.tileXYToLatLon(tmp_tile).getLon() - ts.tileXYToLatLon(act_tile).getLon()) / 256;
tmp_tile = new org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y+1, 19);
var ph = (ts.tileXYToLatLon(tmp_tile).getLat() - ts.tileXYToLatLon(act_tile).getLat()) / 256;

var lnode_x = Math.floor((lnode.lon - ts.tileXYToLatLon(act_tile).getLon()) / pw);
var lnode_y = Math.floor((lnode.lat - ts.tileXYToLatLon(act_tile).getLat()) / ph);

var url_tile_img = javax.imageio.ImageIO.read(new java.net.URL(act_tile.getUrl()));

var wimg_start_lat = ts.tileXYToLatLon(act_tile).getLat() + (lnode_y-28)*ph;
var wimg_start_lon = ts.tileXYToLatLon(act_tile).getLon() + (lnode_x-28)*pw;

var wimg = [];
var c;
for (i = lnode_x-28; i < lnode_x-28+57; i++) {
  for (j = lnode_y-28; j < lnode_y-28+57; j++) {
    c = new java.awt.Color(url_tile_img.getRGB(i, j));
    wimg.push((c.getRed() + c.getGreen() + c.getBlue()) / 3); // make grayscale
  }
}

// inspired by https://github.com/miguelmota/sobel/blob/master/sobel.js

var kernelX = [
  [-1,0,1],
  [-2,0,2],
  [-1,0,1]
];
var kernelY = [
  [-1,-2,-1],
  [0,0,0],
  [1,2,1]
];

var sobel_data = [];

for (y = 1; y < 56; y++) {
  for (x = 1; x < 56; x++) {
    var pixelX = (
    (kernelX[0][0] * wimg[(x - 1)*57 + (y - 1)]) +
    (kernelX[0][1] * wimg[(x)*57 + (y - 1)]) +
    (kernelX[0][2] * wimg[(x + 1)*57 + (y - 1)]) +
    (kernelX[1][0] * wimg[(x - 1)*57 + (y)]) +
    (kernelX[1][1] * wimg[(x)*57 + (y)]) +
    (kernelX[1][2] * wimg[(x + 1)*57 + (y)]) +
    (kernelX[2][0] * wimg[(x - 1)*57 + (y + 1)]) +
    (kernelX[2][1] * wimg[(x)*57 + (y + 1)]) +
    (kernelX[2][2] * wimg[(x + 1)*57 + (y + 1)])
    );

    var pixelY = (
    (kernelY[0][0] * wimg[(x - 1)*57 + (y - 1)]) +
    (kernelY[0][1] * wimg[(x)*57 + (y - 1)]) +
    (kernelY[0][2] * wimg[(x + 1)*57 + (y - 1)]) +
    (kernelY[1][0] * wimg[(x - 1)*57 + (y)]) +
    (kernelY[1][1] * wimg[(x)*57 + (y)]) +
    (kernelY[1][2] * wimg[(x + 1)*57 + (y)]) +
    (kernelY[2][0] * wimg[(x - 1)*57 + (y + 1)]) +
    (kernelY[2][1] * wimg[(x)*57 + (y + 1)]) +
    (kernelY[2][2] * wimg[(x + 1)*57 + (y + 1)])
    );

    var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY));

    sobel_data.push(magnitude);
  }
}

// Circle Hough Transform (CHT)
// see https://en.wikipedia.org/wiki/Circle_Hough_Transform

cbuilding_hist = [0.00035950532067874634, 0.0014380212827149843, 0.010569456427955135, 0.0071901064135749216, 0.01754385964912281, 0.026243888409548503, 0.031205061834915115, 0.046016681046879566, 0.048605119355766405, 0.055435720448662719, 0.060828300258843747, 0.063129134311187898, 0.066939890710382421, 0.066867989646246864, 0.06600517687661768, 0.060253091745757922, 0.058311763014092688, 0.053566292781133097, 0.046160483175151062, 0.040983606557376998, 0.033793500143802273, 0.026747195858498669, 0.024518262870290446, 0.01775956284153013, 0.01553062985332181, 0.01121656600517686, 0.0085562266321541919, 0.0070463042853034126, 0.0060396893874029257, 0.0049611734253666882, 0.004601668104687969, 0.002516537244751219, 0.0013661202185792332, 0.0022289329882082352, 0.0017975266033937276, 0.0010066148979004875, 0.00086281276962898936, 7.1901064135749515e-05, 0.00028760425654299643, 0.00035950532067874558, 0.00028760425654299806, 0.00014380212827149822, 7.1901064135749108e-05, 0.00014380212827149822, 7.1901064135749515e-05, 0.00014380212827149822, 0.0, 7.1901064135749108e-05, 0.0, 0.0, 7.1901064135749108e-05, 0.0, 0.0, 0.0, 7.1901064135749108e-05]

cbuilding_hist_edges = [1.495012940591158e-05, 1.7343754080389494e-05, 1.9737378754867409e-05, 2.2131003429345324e-05, 2.452462810382324e-05, 2.6918252778301155e-05, 2.9311877452779067e-05, 3.1705502127256985e-05, 3.4099126801734897e-05, 3.6492751476212816e-05, 3.8886376150690728e-05, 4.1280000825168646e-05, 4.3673625499646558e-05, 4.6067250174124477e-05, 4.8460874848602389e-05, 5.0854499523080307e-05, 5.3248124197558219e-05, 5.5641748872036131e-05, 5.8035373546514049e-05, 6.0428998220991961e-05, 6.282262289546988e-05, 6.5216247569947785e-05, 6.7609872244425704e-05, 7.0003496918903622e-05, 7.2397121593381527e-05, 7.4790746267859446e-05, 7.7184370942337365e-05, 7.957799561681527e-05, 8.1971620291293188e-05, 8.4365244965771107e-05, 8.6758869640249026e-05, 8.9152494314726931e-05, 9.1546118989204849e-05, 9.3939743663682768e-05, 9.6333368338160673e-05, 9.8726993012638592e-05, 0.00010112061768711651, 0.00010351424236159443, 0.00010590786703607233, 0.00010830149171055025, 0.00011069511638502817, 0.00011308874105950608, 0.00011548236573398399, 0.00011787599040846191, 0.00012026961508293983, 0.00012266323975741774, 0.00012505686443189566, 0.00012745048910637357, 0.00012984411378085149, 0.00013223773845532941, 0.00013463136312980733, 0.00013702498780428525, 0.00013941861247876317, 0.00014181223715324109, 0.00014420586182771898, 0.0001465994865021969]

var min_cbulding_diameter_px = Math.ceil(cbuilding_hist_edges[0]/pw);

function get_ri(r) {
  var i;
  for (i = 0; i < 55-1; i++) {
    if (r > cbuilding_hist_edges[i] && r < cbuilding_hist_edges[i+1]) {
      return i;
    }
  }
}

var EDGE_THRESHOLD = 127;
var accumulator_matrix = [];

for (a = 0; a < 55; a++) {
  accumulator_matrix[a] = [];
  for (b = 0; b < 55; b++) {
    accumulator_matrix[a][b] = [];
    for (ri = 0; ri < 55; ri++) {
      accumulator_matrix[a][b][ri] = 0;
    }
  }
}

for (i = 0; i < sobel_data.length; i++) {
  if (sobel_data[i] > EDGE_THRESHOLD) {
    var x = i % 55;
    var y = Math.floor(i / 55);
    var r = 0;
    var ri = 0;

    // vote
for (a = 27 - min_cbulding_diameter_px; a < 27 + min_cbulding_diameter_px; a++) {
  for (b = 27 - min_cbulding_diameter_px; b < 27 + min_cbulding_diameter_px; b++) {
    r = Math.sqrt((x-a)*(x-a) + (y-b)*(y-b)) * pw;
    ri = get_ri(r);

    accumulator_matrix[a][b][ri] += 1;
  }
}

  }
}

var maximum_voted = [0, 0, 0, 0];

for (a = 0; a < 55; a++) {
  for (b = 0; b < 55; b++) {
    for (ri = 0; ri < 55; ri++) {
      if (accumulator_matrix[a][b][ri] > maximum_voted[0]) {
        maximum_voted[0] = accumulator_matrix[a][b][ri];
        maximum_voted[1] = a;
        maximum_voted[2] = b;
        maximum_voted[3] = ri;
      }
    }
  }
}

var wnode = ds.selection.nodes[ds.selection.nodes.length - 1];
ds.remove(wnode.id, "node");

ds.selection.add(
    ds.nodeBuilder.withPosition(
      wimg_start_lat + maximum_voted[1]*ph,
      wimg_start_lon + maximum_voted[2]*pw - maximum_voted[3]*pw).create(),
    ds.nodeBuilder.withPosition(
      wimg_start_lat + maximum_voted[1]*ph,
      wimg_start_lon + maximum_voted[2]*pw + maximum_voted[3]*pw).create());

ds.selection.add(
    ds.nodeBuilder.withPosition(wimg_start_lat, wimg_start_lon).create(),
    ds.nodeBuilder.withPosition(wimg_start_lat, wimg_start_lon).create());
