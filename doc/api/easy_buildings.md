# Easy buildings API documentation
Go back to [README](../../README.md).

This file contains documentation for `easy_buildings.js` scripts. The goal is
to make building/residential area by as less mouse clicks as possible but not
to use any image processing algorithms. Therefore, building/residential area
borders needs to be specified by mouse click.

## `easy_cbuilding()`
- Two nodes in selection needed.
- `CreateCircleAction` is run.
- Selection is tagged as `building: yes`.

## `easy_obuilding()`
- At least three nodes in selection needed, fourth is computed then.
- For four nodes, finish the way.
- `OrthogonalizeAction` is run.
- Selection is tagged as `building: yes`.
