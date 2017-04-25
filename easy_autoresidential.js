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
    n_min = coords[0], n_min_i=0;
    m = 0;
    border = new Array();

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

    con.println("m = "+m);

    return coords.slice(0, m+1);
}

function expand(coords, by)
{
    var lat_min = 0;
    var lat_max = 0;
    var lon_min = 0;
    var lon_max = 0;

    var lat_middle;
    var lon_middle;

    var n;
    var r, phi;

    for (n in coords) {
        if (coords[n]["lat"] < coords[lat_min]["lat"]) lat_min = n;
        if (coords[n]["lat"] > coords[lat_max]["lat"]) lat_max = n;
        if (coords[n]["lon"] < coords[lon_min]["lon"]) lon_min = n;
        if (coords[n]["lon"] > coords[lon_max]["lon"]) lon_max = n;
    }

    lat_middle = (coords[lat_max]["lat"] + coords[lat_min]["lat"])/2;
    lon_middle = (coords[lon_max]["lon"] + coords[lon_min]["lon"])/2;

    con.println("lat m: "+lat_middle+", lon m: "+lon_middle);

    for (n in coords) {
        // @see https://en.wikipedia.org/wiki/Polar_coordinate_system
        r = Math.sqrt(
                (coords[n]["lat"] - lat_middle)*
                (coords[n]["lat"] - lat_middle) +
                (coords[n]["lon"] - lon_middle)*
                (coords[n]["lon"] - lon_middle));
        phi = Math.atan2(
                (coords[n]["lat"] - lat_middle),
                (coords[n]["lon"] - lon_middle));

        r += by;
        coords[n]["lat"] = r * Math.sin(phi);
        coords[n]["lon"] = r * Math.cos(phi);
    }

    return coords;
}
