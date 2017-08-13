#!/usr/bin/python3
"""From downloaded data, create histogram of square and circle buildings
dimensions.

Data downloaded from Trimble in GeoJSON format, area around Aweil selected.
Then data was parsed with the following command.

::
    cat building_line.json  | \
            grep '"building":"yes"' | \
            sed -n "s/.*\(coordinates[^}]*\).*/\1/p" | \
            sed -n 's/coordinates"://p' | \
            sed -n "s/$/,/p" > \
            building_coordinates.txt

Then data was modified a little bit to be usable as python module (see
``building_coordinates_test.py`` for example).

Finally, this script select square buildings (buildings with 5 nodes) and
circle buildings (buildings with more than 10 nodes) and create histogram of
buildings dimensions.
"""
import numpy
import matplotlib.pyplot as plt
from math import sqrt
#from building_coordinates_test import building_coordinates as bc
from building_coordinates import building_coordinates as bc

HISTOGRAM_BINS = 10

def dist(a, b):
    """Return distance of two points.

    Keyword arguments:
    a -- The first point [x1, y1].
    b -- The second point [x2, y2].
    """
    w = abs(a[0] - b[0])
    h = abs(a[1] - b[1])
    return sqrt(w**2 + h**2)

if __name__ == "__main__":
    square_sum = 0
    circle_sum = 0

    square_wlen = []
    square_hlen = []
    circle_len = []

    square_avg = [0, 0, 0, 0]
    square_avg2 = []
    circle_avg = 0

    square_width_hist = []
    square_height_hist = []
    circle_diameter_hist = []

    for i in bc:
        if len(i) == 5:
            square_sum += 1

            tmp = [
                    dist(i[0], i[1]),
                    dist(i[1], i[2]),
                    dist(i[2], i[3]),
                    dist(i[3], i[0])
                    ]
            tmp.sort()
            square_wlen.append(tmp[0])
            square_wlen.append(tmp[1])
            square_hlen.append(tmp[2])
            square_hlen.append(tmp[3])

        elif len(i) > 10:
            circle_sum += 1

            tmp = [dist(i[0], j) for j in i]
            circle_len.append(max(tmp))

    # TODO create histogram, not average
    for i in square_wlen:
        square_avg[0] += i

    for i in square_hlen:
        square_avg[1] += i

    square_avg = [x/len(square_avg) for x in square_avg]
    circle_avg = sum(circle_len) / len(circle_len)

    square_width_hist = numpy.histogram(square_wlen, bins = HISTOGRAM_BINS,
            density = True)
    square_width_hist_normed = [x/sum(square_width_hist[0]) for x in
            square_width_hist[0]]

    square_height_hist = numpy.histogram(square_hlen, bins = HISTOGRAM_BINS,
            density = True)
    square_height_hist_normed = [x/sum(square_height_hist[0]) for x in
            square_height_hist[0]]

    circle_diameter_hist = numpy.histogram(circle_len, bins = HISTOGRAM_BINS,
            density = True)
    circle_diameter_hist_normed = [x/sum(circle_diameter_hist[0]) for x in
            circle_diameter_hist[0]]

    print("bc size: {}".format(len(bc)))
    print("square buildings: {}".format(square_sum))
    print("  average dimensions: {}, {}".format(*square_avg))
    print("  width min: {}, width max: {}".format(min(square_wlen),
        max(square_wlen)))
    print("  sum hist normed: {}".format(sum(square_width_hist_normed)))
    print("  height min: {}, height max: {}".format(min(square_hlen),
        max(square_hlen)))
    print("  sum hist normed: {}".format(sum(square_height_hist_normed)))
    #square_avg2 = [x*1.1 for x in square_avg2]
    #print("  average dimensions in meters: {}, {}".format(*square_avg2))

    print("circle buildings: {}".format(circle_sum))
    print("  average diameter: {}".format(circle_avg))
    print("  diameter min: {}, max: {}".format(min(circle_len),
        max(circle_len)))
    #print("  average diameter in meters: {}".format(circle_avg*1.1))
    print("  sum hist normed: {}".format(sum(circle_diameter_hist_normed)))

    print("histograms:")
    print(square_width_hist[0])
    print(square_height_hist[0])
    print(circle_diameter_hist[0])

    print("normed histograms:")
    print(square_width_hist_normed)
    print(square_height_hist_normed)
    print(circle_diameter_hist_normed)

    #plt.hist(square_width_hist)
    plt.hist(square_wlen, bins = HISTOGRAM_BINS, normed = True, stacked = True)
    plt.title("Square building width histogram")
    plt.show()

    #plt.hist(square_height_hist)
    plt.hist(square_hlen, bins = HISTOGRAM_BINS, normed = True, stacked = True)
    plt.title("Square building height histogram")
    plt.show()

    #plt.hist(circle_diameter_hist)
    plt.hist(circle_len, bins = HISTOGRAM_BINS, normed = True, stacked = True)
    plt.title("Circle building diameter histogram")
    plt.show()

#    #plt.hist(square_width_hist)
#    plt.hist2d(square_wlen, square_hlen, HISTOGRAM_BINS)
#    plt.title("Square building histogram")
#    plt.show()
#
#    #plt.hist(circle_diameter_hist)
#    plt.hist2d(circle_len, circle_len, HISTOGRAM_BINS)
#    plt.title("Circle building histogram")
#    plt.show()
