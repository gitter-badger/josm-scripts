# Pick residential area API documentation
Go back to [README](../../README.md).

This file contains documentation for `pick_residential.js` script. The goal is
to automatically make residential area around selected buildings.

## `pick_rarea()`
- Select as many buildings as needed.
- Create residential area around the selected buildings.

## `graham_scan()`
- For more information about Graham scan see [1].

## `create_border(b_orig)`
- `b_orig` -- Original border nodes array.

- Expand borders and create residential area of them.

[1]: https://en.wikipedia.org/wiki/Graham_scan
