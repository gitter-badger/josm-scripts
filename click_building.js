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
  con.print(josm.layers.get(1));
  con.print("\nyes\n");
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
tile2 = new org.openstreetmap.gui.jmapviewer.Tile(ts, tile_xy.x+1, tile_xy.y, 19);
con.print("\ntile key: "+tile.getKey());
con.print("\ntile to string: "+tile.toString());
con.print("\ntile url: "+tile.getUrl());
con.print("\ntile lat, lon: "+ts.tileXYToLatLon(tile));
con.print("\ntile image: "+tile.getImage());
con.print("\nlat: "+(ts.tileXYToLatLon(tile2).lon - ts.tileXYToLatLon(tile).lon));
con.print("\n");

con.print("\ntile lat, lon: "+ts.tileXYToLatLon(tile));
con.print("\ntile2 lat, lon: "+ts.tileXYToLatLon(tile2));
con.print("\nnode lat, lon: "+n.lat+", "+n.lon);
con.print("\n");

tile2 = new org.openstreetmap.gui.jmapviewer.Tile(ts, tile_xy.x+1, tile_xy.y, 19);
var pw = Math.abs(ts.tileXYToLatLon(tile2).getLon() - ts.tileXYToLatLon(tile).getLon()) / 256;
tile2 = new org.openstreetmap.gui.jmapviewer.Tile(ts, tile_xy.x, tile_xy.y+1, 19);
var ph = Math.abs(ts.tileXYToLatLon(tile2).getLat() - ts.tileXYToLatLon(tile).getLat()) / 256;

var x = Math.floor(Math.abs(n.lon - ts.tileXYToLatLon(tile).getLon()) / pw);
var y = Math.floor(Math.abs(n.lat - ts.tileXYToLatLon(tile).getLat()) / ph);
con.print("x: " + x + ", y: " + y);
//con.print("\ngetRGB: "+tile.getImage().getRGB(x, y));
con.print("\ngetRGB: "+tile.getImage().getRGB(x, y));
con.print("\n");

var tile_img = tile.getImage();
var tmp_img = new java.awt.image.BufferedImage(55, 55, 2); // TYPE_INT_ARGB
con.print("\ntile_img: "+tile_img);
con.print("\ntile_img RGB: "+tile_img.getRGB(0,0));
con.print("\ntmp_img: "+tmp_img);
con.print("\n");
// row 60

var c = new java.awt.Color(tile_img.getRGB(x, y));
//var c = new java.awt.image.Color;
con.print("\nR: "+c.getRed());
con.print("\nG: "+c.getGreen());
con.print("\nB: "+c.getBlue());
con.print("\nA: "+c.getAlpha());


// Tile width (lon): 0.0006866455078125
// Tile width (lon): -0.0006866455078125
// Tile height (lat): -0.0006755634657054088
// Tile height (lat): 0.0006755620169709431
// http://wiki.openstreetmap.org/wiki/Zoom_levels

// 1px should be 0.2950429916381836m

var p = ts.latLonToXY(n.lat, n.lon, 19);
con.print("\nlat:"+n.lat+", lon:"+n.lon);
con.print("\n");
con.print("x:"+p.x+", y:"+p.y);
con.print("\n");
//con.print(tile.image.getSubimage(0, 0, 100, 100));
//con.print(tile.image.getData());
//con.print(tile.image);
con.print("\ntile getImage(): "+tile.getImage());
con.print("\n");
// TODO where in tile (pixels) is node (wgs84)?


// row 90
var url_tile_img = javax.imageio.ImageIO.read(new java.net.URL(tile.getUrl()));
var tile_img_part = [];
//con.print("\ntile img: "+tile_img);
//con.print("\ntile img array follows:\n");
//for (i = 0; i < tile_img.getWidth(); i++) {
//  for (j = 0; j < tile_img.getHeight(); j++) {
//    con.print(tile_img.getRGB(i, j)+" ");
//  }
//  con.print("\n");
//}
// row 100
//for (i = 0; i < 55; i++) {
//  for (j = 0; j < 55; j++) {
//    tile_img_part.push(new java.awt.Color(tile_img.getRGB(x-27+i, y-27+j)));
//  }
//}
//tmp_img.getGraphics().drawImage(tile_img, x-27, y-27, null);
//tmp_img.getGraphics().dispose();
//tile_img_part = tile_img.getRGB(x-27, y-27, 55, 55, null, 0, tile_img.getWidth());
//tile_img_part = tile_img.getRGB(x-27, y-27, 55, 55, null, 0, tile_img.getWidth());

con.print("\nurl tile img: "+url_tile_img);
con.print("\n");

//tile_img_part = url_tile_img.getRGB(x-27, y-27, 55, 55, null, 0, tile_img.getWidth());
tile_img_part = url_tile_img.getRGB(0, 0, 57, 57, null, 0, tile_img.getWidth());
con.print("\nurl tile img part: "+tile_img_part);
//con.print("\n");

con.print("\ntile img part length: "+tile_img_part.length);
con.print("\n");
//tile_img_part = tile_img.getRGB(0, 0, tmp_img.getWidth(), tmp_img.getHeight(), null, 0, tile_img.getWidth());
for (i = 0; i < 57; i++) {
  for (j = 0; j < 57; j++) {
    //con.print(tile_img_part[i*57 + j]+" ");
    //con.print(tmp_img.getRGB(i, j)+" ");
    //con.print(tile_img.getRaster().getDataElements(i, j, null)+" ");
    //con.print(tile_img.getRaster().getSample(i, j, 0)+" ");
  }
  //con.print("\n");
}

// for url tile img, looks great
//for (i = 0; i < url_tile_img.getWidth(); i++) {
//  for (j = 0; j < url_tile_img.getHeight(); j++) {
//    con.print(url_tile_img.getRGB(i, j)+" ");
//  }
//}

var wimg = [];
// for url tile img, limit to 57
for (i = x-28; i < x-28+57; i++) {
  for (j = y-28; j < y-28+57; j++) {
    //con.print(url_tile_img.getRGB(i, j)+" ");
    c = new java.awt.Color(url_tile_img.getRGB(i, j));
    //con.print("R:"+c.getRed()+",G:"+c.getGreen()+",B:"+c.getBlue()+" ");
    //wimg.push(url_tile_img.getRGB(i, j));
    wimg.push((c.getRed() + c.getGreen() + c.getBlue()) / 3); // make grayscale
  }
}

con.print("\n\n---\n\n");

//for (i = 0; i < tile_img_part.length; i+=4) {
//  color = tile_img_part[i+0] << 24 | tile_img_part[i+1] << 16 | tile_img_part[i+2] << 8 | tile_img_part[i+3] << 0;
//  con.print(color + " ");
//}

//for (i = 0; i < 57; i++) {
//  for (j = 0; j < 57; j++) {
//    con.print(wimg[i*57 + j]+" ");
//  }
//  con.print("\n");
//}

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

//for (i = 0; i < 55; i++) {
//  for (j = 0; j < 55; j++) {
//    con.print(sobel_data[i*55 + j]+" ");
//  }
//  con.print("\n");
//}

// Circle Hough Transform (CHT)
// see https://en.wikipedia.org/wiki/Circle_Hough_Transform

cbuilding_hist = [0.00035950532067874634, 0.0014380212827149843, 0.010569456427955135, 0.0071901064135749216, 0.01754385964912281, 0.026243888409548503, 0.031205061834915115, 0.046016681046879566, 0.048605119355766405, 0.055435720448662719, 0.060828300258843747, 0.063129134311187898, 0.066939890710382421, 0.066867989646246864, 0.06600517687661768, 0.060253091745757922, 0.058311763014092688, 0.053566292781133097, 0.046160483175151062, 0.040983606557376998, 0.033793500143802273, 0.026747195858498669, 0.024518262870290446, 0.01775956284153013, 0.01553062985332181, 0.01121656600517686, 0.0085562266321541919, 0.0070463042853034126, 0.0060396893874029257, 0.0049611734253666882, 0.004601668104687969, 0.002516537244751219, 0.0013661202185792332, 0.0022289329882082352, 0.0017975266033937276, 0.0010066148979004875, 0.00086281276962898936, 7.1901064135749515e-05, 0.00028760425654299643, 0.00035950532067874558, 0.00028760425654299806, 0.00014380212827149822, 7.1901064135749108e-05, 0.00014380212827149822, 7.1901064135749515e-05, 0.00014380212827149822, 0.0, 7.1901064135749108e-05, 0.0, 0.0, 7.1901064135749108e-05, 0.0, 0.0, 0.0, 7.1901064135749108e-05]

cbuilding_hist_edges = [1.495012940591158e-05, 1.7343754080389494e-05, 1.9737378754867409e-05, 2.2131003429345324e-05, 2.452462810382324e-05, 2.6918252778301155e-05, 2.9311877452779067e-05, 3.1705502127256985e-05, 3.4099126801734897e-05, 3.6492751476212816e-05, 3.8886376150690728e-05, 4.1280000825168646e-05, 4.3673625499646558e-05, 4.6067250174124477e-05, 4.8460874848602389e-05, 5.0854499523080307e-05, 5.3248124197558219e-05, 5.5641748872036131e-05, 5.8035373546514049e-05, 6.0428998220991961e-05, 6.282262289546988e-05, 6.5216247569947785e-05, 6.7609872244425704e-05, 7.0003496918903622e-05, 7.2397121593381527e-05, 7.4790746267859446e-05, 7.7184370942337365e-05, 7.957799561681527e-05, 8.1971620291293188e-05, 8.4365244965771107e-05, 8.6758869640249026e-05, 8.9152494314726931e-05, 9.1546118989204849e-05, 9.3939743663682768e-05, 9.6333368338160673e-05, 9.8726993012638592e-05, 0.00010112061768711651, 0.00010351424236159443, 0.00010590786703607233, 0.00010830149171055025, 0.00011069511638502817, 0.00011308874105950608, 0.00011548236573398399, 0.00011787599040846191, 0.00012026961508293983, 0.00012266323975741774, 0.00012505686443189566, 0.00012745048910637357, 0.00012984411378085149, 0.00013223773845532941, 0.00013463136312980733, 0.00013702498780428525, 0.00013941861247876317, 0.00014181223715324109, 0.00014420586182771898, 0.0001465994865021969]

con.print("\n");
con.print("\ncircle building min diameter px (pw): "+cbuilding_hist_edges[0]/pw);
con.print("\ncircle building min diameter px (ph): "+cbuilding_hist_edges[0]/ph);

var min_cbulding_diameter_px = Math.ceil(cbuilding_hist_edges[0]/pw);
con.print("\ncircle building min diameter px: "+min_cbulding_diameter_px);
con.print("\n");

function get_ri(r) {
  var i;
  for (i = 0; i < 55; i++) {
    if (r > min_cbulding_diameter_px[i]) {
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
    r = Math.sqrt((x-a)*(x-a) + (y-b)*(y-b));
    ri = get_ri(r);
    //accumulator_matrix[a][b][ri] += cbuilding_hist[ri] * sobel_data[i];
    accumulator_matrix[a][b][ri] += 1;
  }
}

    //con.print("["+x+", "+y+"]: "+sobel_data[i]+", ");
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
