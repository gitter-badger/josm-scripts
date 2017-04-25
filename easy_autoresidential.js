/*
    Easy autoresidential - create residential area around selected buildings.
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

// general includes
var JSAction = require("josm/ui/menu").JSAction;

// Graham scan implementation
// @see https://en.wikipedia.org/wiki/Graham_scan
function ccw(p1, p2, p3)
{
    return (p2["lon"] - p1["lon"])*(p3["lat"] - p1["lat"]) - 
        (p2["lat"] - p1["lat"])*(p3["lon"] - p1["lon"]);
}

function graham_scan(coords)
{
    n_min = coords[0], n_min_i = 0;
    border = new Array();

    for (n in coords) {
        if (coords[n]["lat"] < n_min["lat"]) {
            n_min = coords[n];
            n_min_i = n;
        }
    }

    coords[n_min_i] = coords[0];
    coords[0] = n_min;
}
