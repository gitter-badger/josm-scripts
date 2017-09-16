/*
    Click buildings - create building by one click.
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

// constants
CBUILDING_HIST = [0.00035950532067874634, 0.0014380212827149843, 0.010569456427955135, 0.0071901064135749216, 0.01754385964912281, 0.026243888409548503, 0.031205061834915115, 0.046016681046879566, 0.048605119355766405, 0.055435720448662719, 0.060828300258843747, 0.063129134311187898, 0.066939890710382421, 0.066867989646246864, 0.06600517687661768, 0.060253091745757922, 0.058311763014092688, 0.053566292781133097, 0.046160483175151062, 0.040983606557376998, 0.033793500143802273, 0.026747195858498669, 0.024518262870290446, 0.01775956284153013, 0.01553062985332181, 0.01121656600517686, 0.0085562266321541919, 0.0070463042853034126, 0.0060396893874029257, 0.0049611734253666882, 0.004601668104687969, 0.002516537244751219, 0.0013661202185792332, 0.0022289329882082352, 0.0017975266033937276, 0.0010066148979004875, 0.00086281276962898936, 7.1901064135749515e-05, 0.00028760425654299643, 0.00035950532067874558, 0.00028760425654299806, 0.00014380212827149822, 7.1901064135749108e-05, 0.00014380212827149822, 7.1901064135749515e-05, 0.00014380212827149822, 0.0, 7.1901064135749108e-05, 0.0, 0.0, 7.1901064135749108e-05, 0.0, 0.0, 0.0, 7.1901064135749108e-05]

CBUILDING_HIST_EDGES = [1.495012940591158e-05, 1.7343754080389494e-05, 1.9737378754867409e-05, 2.2131003429345324e-05, 2.452462810382324e-05, 2.6918252778301155e-05, 2.9311877452779067e-05, 3.1705502127256985e-05, 3.4099126801734897e-05, 3.6492751476212816e-05, 3.8886376150690728e-05, 4.1280000825168646e-05, 4.3673625499646558e-05, 4.6067250174124477e-05, 4.8460874848602389e-05, 5.0854499523080307e-05, 5.3248124197558219e-05, 5.5641748872036131e-05, 5.8035373546514049e-05, 6.0428998220991961e-05, 6.282262289546988e-05, 6.5216247569947785e-05, 6.7609872244425704e-05, 7.0003496918903622e-05, 7.2397121593381527e-05, 7.4790746267859446e-05, 7.7184370942337365e-05, 7.957799561681527e-05, 8.1971620291293188e-05, 8.4365244965771107e-05, 8.6758869640249026e-05, 8.9152494314726931e-05, 9.1546118989204849e-05, 9.3939743663682768e-05, 9.6333368338160673e-05, 9.8726993012638592e-05, 0.00010112061768711651, 0.00010351424236159443, 0.00010590786703607233, 0.00010830149171055025, 0.00011069511638502817, 0.00011308874105950608, 0.00011548236573398399, 0.00011787599040846191, 0.00012026961508293983, 0.00012266323975741774, 0.00012505686443189566, 0.00012745048910637357, 0.00012984411378085149, 0.00013223773845532941, 0.00013463136312980733, 0.00013702498780428525, 0.00013941861247876317, 0.00014181223715324109, 0.00014420586182771898, 0.0001465994865021969]

var KERNEL_X = [
    [-1,0,1],
    [-2,0,2],
    [-1,0,1]
];
var KERNEL_Y = [
    [-1,-2,-1],
    [0,0,0],
    [1,2,1]
];
var EDGE_THRESHOLD = 127;

// working image size constants
// I -- inner, O -- outer, F -- full, H -- half
var IFSIZE = 55;
var IHSIZE = (IFSIZE - 1) / 2;
var OFSIZE = IFSIZE + 2;
var OHSIZE = (OFSIZE - 1) / 2;

var DIRECTION = [];

DIRECTION.push([1, 0]);
DIRECTION.push([1, 1]);
DIRECTION.push([0, 1]);
DIRECTION.push([-1, 1]);
DIRECTION.push([-1, 0]);
DIRECTION.push([-1, -1]);
DIRECTION.push([0, -1]);
DIRECTION.push([1, -1]);

// Sobel filter
// @see https://en.wikipedia.org/wiki/Sobel_operator
// @see https://github.com/miguelmota/sobel
function sobel_filter(wimg) {
    var sobel_data = [];

    for (y = 1; y < OFSIZE-1; y++) {
        for (x = 1; x < OFSIZE-1; x++) {
            var pixel_x = (
            (KERNEL_X[0][0] * wimg[(x - 1)*OFSIZE + (y - 1)]) +
            (KERNEL_X[0][1] * wimg[(x)*OFSIZE + (y - 1)]) +
            (KERNEL_X[0][2] * wimg[(x + 1)*OFSIZE + (y - 1)]) +
            (KERNEL_X[1][0] * wimg[(x - 1)*OFSIZE + (y)]) +
            (KERNEL_X[1][1] * wimg[(x)*OFSIZE + (y)]) +
            (KERNEL_X[1][2] * wimg[(x + 1)*OFSIZE + (y)]) +
            (KERNEL_X[2][0] * wimg[(x - 1)*OFSIZE + (y + 1)]) +
            (KERNEL_X[2][1] * wimg[(x)*OFSIZE + (y + 1)]) +
            (KERNEL_X[2][2] * wimg[(x + 1)*OFSIZE + (y + 1)])
            );

            var pixel_y = (
            (KERNEL_Y[0][0] * wimg[(x - 1)*OFSIZE + (y - 1)]) +
            (KERNEL_Y[0][1] * wimg[(x)*OFSIZE + (y - 1)]) +
            (KERNEL_Y[0][2] * wimg[(x + 1)*OFSIZE + (y - 1)]) +
            (KERNEL_Y[1][0] * wimg[(x - 1)*OFSIZE + (y)]) +
            (KERNEL_Y[1][1] * wimg[(x)*OFSIZE + (y)]) +
            (KERNEL_Y[1][2] * wimg[(x + 1)*OFSIZE + (y)]) +
            (KERNEL_Y[2][0] * wimg[(x - 1)*OFSIZE + (y + 1)]) +
            (KERNEL_Y[2][1] * wimg[(x)*OFSIZE + (y + 1)]) +
            (KERNEL_Y[2][2] * wimg[(x + 1)*OFSIZE + (y + 1)])
            );

            var magnitude = Math.sqrt((pixel_x * pixel_x) + (pixel_y * pixel_y));
            sobel_data.push(magnitude);
        }
    }

    return sobel_data;
}

// Circle Hough Transform (CHT)
// @see https://en.wikipedia.org/wiki/Circle_Hough_Transform
function get_ri(r) {
    var i;

    for (i = 0; i < IFSIZE-1; i++) {
        if (r < CBUILDING_HIST_EDGES[i+1]) {
            return i;
        }
    }
    return IFSIZE-1;
}

function circle_hough_transform(sobel_data, CBUILDING_MIND, PW) {
    var accumulator_matrix = [];
    var voted = false;

    for (a = 0; a < IFSIZE; a++) {
        accumulator_matrix[a] = [];
        for (b = 0; b < IFSIZE; b++) {
            accumulator_matrix[a][b] = [];
            for (ri = 0; ri < IFSIZE; ri++) {
                accumulator_matrix[a][b][ri] = 0;
            }
        }
    }

    for (i = 0; i < sobel_data.length; i++) {
        if (sobel_data[i] > EDGE_THRESHOLD) {
            var x = i % IFSIZE;
            var y = Math.floor(i / IFSIZE);
            var r = 0;
            var ri = 0;

            // vote
for (a = IHSIZE - CBUILDING_MIND; a < IHSIZE + CBUILDING_MIND; a++) {
    for (b = IHSIZE - CBUILDING_MIND; b < IHSIZE + CBUILDING_MIND; b++) {
        r = Math.sqrt((x-a)*(x-a) + (y-b)*(y-b)) * PW;
        ri = get_ri(r);

        accumulator_matrix[a][b][ri] += CBUILDING_HIST[ri];
    }
}

        voted = true;
        }
    }

    if (voted == false) {
        accumulator_matrix[IHSIZE][IHSIZE][CBUILDING_MIND] = 1;
    }

    return accumulator_matrix;
}

function circle_find_max_voted(accumulator_matrix) {
    var maximum_voted = [0, 0, 0, 0];

    for (a = 0; a < IFSIZE; a++) {
        for (b = 0; b < IFSIZE; b++) {
            for (ri = 0; ri < IFSIZE; ri++) {
                if (accumulator_matrix[a][b][ri] > maximum_voted[0]) {
                    maximum_voted[0] = accumulator_matrix[a][b][ri];
                    maximum_voted[1] = a;
                    maximum_voted[2] = b;
                    maximum_voted[3] = ri;
                }
            }
        }
    }

    return maximum_voted;
}

function direction_feasible(x, y, dir, sobel_data) {
    if (x + dir[0] < 0) return false;
    if (y + dir[1] < 0) return false;
    if (x + dir[0] >= IFSIZE) return false;
    if (y + dir[1] >= IFSIZE) return false;
    if (sobel_data[y*IFSIZE + x] <= EDGE_THRESHOLD) return false;
    return true;
}

function find_corner(sobel_data) {
    var accumulator_matrix = [];
    var voted = false;

    for (i = 0; i < sobel_data.length; i++) {
        if (sobel_data[i] > EDGE_THRESHOLD) {
            var x = i % IFSIZE;
            var y = Math.floor(i / IFSIZE);

            // vote
            DIRECTION.forEach(function(dir, dir_ind, dir_ar) {
                var max_d1 = 0;
                var max_d2 = 0;
                var act_x = x;
                var act_y = y;
                var act_dir = dir;
                while (direction_feasible(act_x, act_y, act_dir, sobel_data)) {
                    act_x += act_dir[0];
                    act_y += act_dir[1];
                    max_d1 += 1;
                }
                act_x = x;
                act_y = y;
                act_dir = dir_ar[(dir_ind + 2)%DIRECTION.length];
                while (direction_feasible(act_x, act_y, act_dir, sobel_data)) {
                    act_x += act_dir[0];
                    act_y += act_dir[1];
                    max_d2 += 1;
                }
                accumulator_matrix.push([x, y, dir_ind, max_d1, max_d2]);
            });
            voted = true;
        }
    }

    if (voted == false) {
        accumulator_matrix.push([-10, -10, 0, 21, 21]);
    }

    return accumulator_matrix;
}

function orthogonal_find_max_voted(accumulator_matrix) {
    var maximum_voted = [0, 0, 0, 0, 0];

    accumulator_matrix.forEach(function(ite, ind, arr) {
        if (ite[3] + ite[4] > maximum_voted[3] + maximum_voted[4]) {
            maximum_voted = ite;
        }
    });

    return maximum_voted;
}

function get_node_xy(node, ts) {
    var act_tile_xy = ts.latLonToTileXY(node.lat, node.lon, 19);
    var act_tile = org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y, 19);
    var tmp_tile = org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x+1, act_tile_xy.y, 19);
    var pw = (ts.tileXYToLatLon(tmp_tile).getLon() - ts.tileXYToLatLon(act_tile).getLon()) / 256;

    tmp_tile = org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y+1, 19);
    var ph = (ts.tileXYToLatLon(tmp_tile).getLat() - ts.tileXYToLatLon(act_tile).getLat()) / 256;

    var x = Math.floor((node.lon - ts.tileXYToLatLon(act_tile).getLon()) / pw);
    var y = Math.floor((node.lat - ts.tileXYToLatLon(act_tile).getLat()) / ph);

    return [x, y, pw, ph];
}

function get_wimg(node, ts) {
    var act_tile_xy = ts.latLonToTileXY(node.lat, node.lon, 19);
    var act_tile_img;

    var node_xy = get_node_xy(node, ts);
    var wimg = [];
    var x, y, c;

    for (y = 0; y < OFSIZE; y++) {
        for (x = 0; x < OFSIZE; x++) {
            wimg.push(0);
        }
    }

    // tiles url
    //
    // [0][1][2]
    // [3][4][5]
    // [6][7][8]
    //
    // act_tile is tile 4
    var tiles_url = [];
    for (x = 0; x < 9; x++) { tiles_url.push(""); }
    tiles_url[4] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y, 19).getUrl());
    if (node_xy[0] < OHSIZE && node_xy[1] < OHSIZE) { // process tile 0, 1, 3 & 4
        tiles_url[0] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x-1, act_tile_xy.y-1, 19).getUrl());
        tiles_url[1] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y-1, 19).getUrl());
        tiles_url[3] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x-1, act_tile_xy.y, 19).getUrl());
        var ofleft = OHSIZE - node_xy[0];
        var oftop = OHSIZE - node_xy[1];
        // tile 0
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[0]);
        for (y = 0; y < oftop; y++) {
            for (x = 0; x < ofleft; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 - ofleft + x, 256 - oftop + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 1
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[1]);
        for (y = 0; y < oftop; y++) {
            for (x = ofleft; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x - ofleft, 256 - oftop + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 3
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[3]);
        for (y = oftop; y < OFSIZE; y++) {
            for (x = 0; x < ofleft; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 - ofleft + x, y - oftop));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = oftop; y < OFSIZE; y++) {
            for (x = ofleft; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x - ofleft, y - oftop));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }
    if (node_xy[0] < OHSIZE && node_xy[1] >= OHSIZE && node_xy[1] + OHSIZE < 256) { // process tile 3 & 4
        tiles_url[3] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x-1, act_tile_xy.y, 19).getUrl());
        var ofleft = OHSIZE - node_xy[0];
        // tile 3
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[3]);
        for (y = 0; y < OFSIZE; y++) {
            for (x = 0; x < ofleft; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 - ofleft + x, y+node_xy[1]-OHSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = 0; y < OFSIZE; y++) {
            for (x = ofleft; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x - ofleft, y+node_xy[1]-OHSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }
    if (node_xy[0] < OHSIZE && node_xy[1] + OHSIZE >= 256) { // process tile 3, 6, 7 & 4
        tiles_url[3] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x-1, act_tile_xy.y, 19).getUrl());
        tiles_url[6] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x-1, act_tile_xy.y+1, 19).getUrl());
        tiles_url[7] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y+1, 19).getUrl());
        var ofleft = OHSIZE - node_xy[0];
        var ofdown = 256 + OHSIZE - node_xy[1];
        // tile 3
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[3]);
        for (y = 0; y < OFSIZE - ofdown; y++) {
            for (x = 0; x < ofleft; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 - ofleft + x, 256 + ofdown - OFSIZE + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 6
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[6]);
        for (y = OFSIZE - ofdown; y < OFSIZE; y++) {
            for (x = 0; x < ofleft; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 - ofleft + x, y + ofdown - OFSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 7
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[7]);
        for (y = OFSIZE - ofdown; y < OFSIZE; y++) {
            for (x = ofleft; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x - ofleft, y + ofdown - OFSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = 0; y < OFSIZE - ofdown; y++) {
            for (x = ofleft; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x - ofleft, 256 + ofdown - OFSIZE + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }
    if (node_xy[0] >= OHSIZE && node_xy[0] + OHSIZE < 256 && node_xy[1] + OHSIZE >= 256) { // process tile 7 & 4
        tiles_url[7] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y+1, 19).getUrl());
        var ofdown = 256 + OHSIZE - node_xy[1];
        // tile 7
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[7]);
        for (y = OFSIZE - ofdown; y < OFSIZE; y++) {
            for (x = 0; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x+node_xy[0]-OHSIZE, y + ofdown - OFSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = 0; y < OFSIZE - ofdown; y++) {
            for (x = 0; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x+node_xy[0]-OHSIZE, 256 + ofdown - OFSIZE + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }
    if (node_xy[0] + OHSIZE >= 256 && node_xy[1] + OHSIZE >= 256) { // process tile 7, 8, 5 & 4
        tiles_url[7] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y+1, 19).getUrl());
        tiles_url[8] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x+1, act_tile_xy.y+1, 19).getUrl());
        tiles_url[5] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x+1, act_tile_xy.y, 19).getUrl());
        var ofright = 256 + OHSIZE - node_xy[0];
        var ofdown = 256 + OHSIZE - node_xy[1];
        // tile 7
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[7]);
        for (y = OFSIZE - ofdown; y < OFSIZE; y++) {
            for (x = 0; x < OFSIZE - ofright; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 + ofright - OFSIZE + x, y + ofdown - OFSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 8
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[8]);
        for (y = OFSIZE - ofdown; y < OFSIZE; y++) {
            for (x = OFSIZE - ofright; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x + ofright - OFSIZE, y + ofdown - OFSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 5
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[5]);
        for (y = 0; y < OFSIZE - ofdown; y++) {
            for (x = OFSIZE - ofright; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x + ofright - OFSIZE, 256 + ofdown - OFSIZE + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = 0; y < OFSIZE - ofdown; y++) {
            for (x = 0; x < OFSIZE - ofright; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 + ofright - OFSIZE + x, 256 + ofdown - OFSIZE + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }
    if (node_xy[0] + OHSIZE >= 256 && node_xy[1] >= OHSIZE && node_xy[1] + OHSIZE < 256) { // process tile 5 & 4
        tiles_url[5] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x+1, act_tile_xy.y, 19).getUrl());
        var ofright = 256 + OHSIZE - node_xy[0];
        // tile 5
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[5]);
        for (y = 0; y < OFSIZE; y++) {
            for (x = OFSIZE - ofright; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x + ofright - OFSIZE, y+node_xy[1]-OHSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = 0; y < OFSIZE; y++) {
            for (x = 0; x < OFSIZE - ofright; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 + ofright - OFSIZE + x, y+node_xy[1]-OHSIZE));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }
    if (node_xy[0] + OHSIZE >= 256 && node_xy[1] < OHSIZE) { // process tile 1, 2, 5 & 4
        tiles_url[1] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y-1, 19).getUrl());
        tiles_url[2] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x+1, act_tile_xy.y-1, 19).getUrl());
        tiles_url[5] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x+1, act_tile_xy.y, 19).getUrl());
        var oftop = OHSIZE - node_xy[1];
        var ofright = 256 + OHSIZE - node_xy[0];
        // tile 1
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[1]);
        for (y = 0; y < oftop; y++) {
            for (x = 0; x < OFSIZE - ofright; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 + ofright - OFSIZE + x, 256 - oftop + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 2
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[2]);
        for (y = 0; y < oftop; y++) {
            for (x = OFSIZE - ofright; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x + ofright - OFSIZE, 256 - oftop + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 5
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[5]);
        for (y = oftop; y < OFSIZE; y++) {
            for (x = OFSIZE - ofright; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x + ofright - OFSIZE, y - oftop));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = oftop; y < OFSIZE; y++) {
            for (x = 0; x < OFSIZE - ofright; x++) {
                c = java.awt.Color(act_tile_img.getRGB(256 + ofright - OFSIZE + x, y - oftop));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }
    if (node_xy[0] >= OHSIZE && node_xy[0] + OHSIZE < 256 && node_xy[1] < OHSIZE) { // process tile 1 & 4
        tiles_url[1] = java.net.URL(org.openstreetmap.gui.jmapviewer.Tile(ts, act_tile_xy.x, act_tile_xy.y-1, 19).getUrl());
        var oftop = OHSIZE - node_xy[1];
        // tile 1
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[1]);
        for (y = 0; y < oftop; y++) {
            for (x = 0; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x+node_xy[0]-OHSIZE, 256 - oftop + y));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = oftop; y < OFSIZE; y++) {
            for (x = 0; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x+node_xy[0]-OHSIZE, y - oftop));
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }
    // process tile 4
    if (node_xy[0] >= OHSIZE && node_xy[0] + OHSIZE < 256 &&
            node_xy[1] >= OHSIZE && node_xy[1] + OHSIZE < 256) {
        // tile 4
        act_tile_img = javax.imageio.ImageIO.read(tiles_url[4]);
        for (y = 0; y < OFSIZE; y++) {
            for (x = 0; x < OFSIZE; x++) {
                c = java.awt.Color(act_tile_img.getRGB(x+node_xy[0]-OHSIZE, y+node_xy[1]-OHSIZE));
                // make grayscale
                wimg[y*OFSIZE + x] = ((c.getRed()+c.getGreen()+c.getBlue())/3);
            }
        }
    }

    return wimg;
}

function click_cbuilding() {
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;

    var lnode = ds.selection.nodes[ds.selection.nodes.length - 1];
    var ts = josm.layers.get(1).getTileSourceStatic(josm.layers.get(1).info);
    var lnode_xy = get_node_xy(lnode, ts);

    var wimg = get_wimg(lnode, ts);
    var sobel_data = sobel_filter(wimg);
    var accumulator_matrix = circle_hough_transform(sobel_data,
            Math.ceil(CBUILDING_HIST_EDGES[0]/lnode_xy[2]), lnode_xy[2]);
    var maximum_voted = circle_find_max_voted(accumulator_matrix);

    ds.remove(lnode.id, "node");
    ds.selection.add(
            ds.wayBuilder.withNodes(
                ds.nodeBuilder.withPosition(
                    lnode.lat + (-IHSIZE+maximum_voted[2])*lnode_xy[3],
                    lnode.lon + (-IHSIZE+maximum_voted[1]-maximum_voted[3])*lnode_xy[2]).create(),
                ds.nodeBuilder.withPosition(
                    lnode.lat + (-IHSIZE+maximum_voted[2])*lnode_xy[3],
                    lnode.lon + (-IHSIZE+maximum_voted[1]+maximum_voted[3])*lnode_xy[2]).create()).create());

    // from `easy_buildings.js`
    easy_cbuilding();
}

function click_obuilding() {
    var active_layer = josm.layers.activeLayer;
    var ds = active_layer.data;

    var lnode = ds.selection.nodes[ds.selection.nodes.length - 1];
    var ts = josm.layers.get(1).getTileSourceStatic(josm.layers.get(1).info);
    var lnode_xy = get_node_xy(lnode, ts);

    var wimg = get_wimg(lnode, ts);
    var sobel_data = sobel_filter(wimg);

    var accumulator_matrix = find_corner(sobel_data);
    var ob_pos = orthogonal_find_max_voted(accumulator_matrix);

    ds.remove(lnode.id, "node");
    ds.selection.add(
            ds.wayBuilder.withNodes(
                ds.nodeBuilder.withPosition(
                    lnode.lat + (-IHSIZE+ob_pos[1]+DIRECTION[ob_pos[2]][1]*ob_pos[3])*lnode_xy[3],
                    lnode.lon + (-IHSIZE+ob_pos[0]+DIRECTION[ob_pos[2]][0]*ob_pos[3])*lnode_xy[2]).create(),
                ds.nodeBuilder.withPosition(
                    lnode.lat + (-IHSIZE+ob_pos[1])*lnode_xy[3],
                    lnode.lon + (-IHSIZE+ob_pos[0])*lnode_xy[2]).create(),
                ds.nodeBuilder.withPosition(
                    lnode.lat + (-IHSIZE+ob_pos[1]+DIRECTION[(ob_pos[2]+2)%DIRECTION.length][1]*ob_pos[4])*lnode_xy[3],
                    lnode.lon + (-IHSIZE+ob_pos[0]+DIRECTION[(ob_pos[2]+2)%DIRECTION.length][0]*ob_pos[4])*lnode_xy[2]).create()).create());

    // from `easy_buildings.js`
    easy_obuilding();
}

// create menu entries
var JSAction = require("josm/ui/menu").JSAction;

// create click circle building menu entry
var create_click_cbuilding = new JSAction({
    name: "Click Circle Building",
    tooltip: "Create circle building by one click",
    onExecute: function() {
        click_cbuilding();
}});

// create click orthogonal building menu entry
var create_click_obuilding = new JSAction({
    name: "Click Orthogonal Building",
    tooltip: "Create orthogonal building by one click",
    onExecute: function() {
        click_obuilding();
}});
