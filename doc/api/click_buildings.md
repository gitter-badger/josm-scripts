# Click buildings API documentation
Go back to [README](../../README.md).

This file contains documentation for `click_buildings.js` scripts. The goal is
to create building by one mouse click to the middle of a building. This script
is dependent on *Easy buildings* script.

## `click_cbuilding()`
- Click to the middle of the building needed.
- Load tiles by `get_wimg` function.
- Use Sobel filter [1], [2] for edge detection in image by `sobel_filter`
  function.
- Use Circle Hough Transform (CHT) [3] to detect circle building parameters by
  functions `circle_hough_transform`, `find_max_voted`.

## `get_wimg(node, ts)`
- `node` -- Coordinates of clicked node.
- `ts` -- Tile source.
- Return `wimg` array with size `57 x 57` pixels.

- Load tiles needed for image processing.

## `sobel_filter(wimg)`
- `wimg` -- Grayscale image in format of array.
- Return `sobel_data` array with size `55*55`.

- Detect edges in image.
- Values of array are from 0 (not edge) to 255 (is edge).

## `circle_hough_transform(sobel_data, CBUILDING_MIND, PW)`
- `sobel_data` -- Sobel data with detected edges.
- `CBUILDING_MIND` -- Minimum diameter of circle building from histogram.
- `PW` -- Pixel width constant used to recompute pixels to meters.
- Return `accumulator_matrix` 3D array with voted circle arguments.

- Test parameters `a`, `b`, `r` of circle `r**2 = (x-a)**2 + (y-b)**2`.
- Increase `a`, `b`, `r` parameters combination in `accumulator_matrix` by
  probability value from histogram.

## `find_max_voted(accumulator_matrix)`
- `accumulator_matrix` -- 3D array with probability evaluated arguments.
- Return array containig maximum voted parameters.

- Find maximum in 3D circle arguments space.

[1]: https://en.wikipedia.org/wiki/Sobel_operator
[2]: https://github.com/miguelmota/sobel
[3]: https://en.wikipedia.org/wiki/Circle_Hough_Transform
