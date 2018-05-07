# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog] and this project adheres to [Semantic
Versioning].

## [Unreleased]
### Added
- Contributing information.
- Video tutorial.

### Changed
- Project became testing platform after [Mapathoner JOSM plugin] release.

[Mapathoner JOSM plugin]: https://github.com/qeef/mapathoner

## [0.3.3] - 2018-03-27
### Fixed
- Fix link in credits.

## [0.3.2] - 2018-03-27
### Changed
- Rename *Pick residential* in credits.
- Reorder scripts in [README].

## [0.3.1] - 2017-11-06
### Changed
- More human-like residential areas.

## [0.3.0] - 2017-10-01
### Added
- Batch circle building function.
- Batch orthogonal building function.

### Changed
- *Easy Circle Building* shortcut now implements batch circle building
  creation. It is backward compatible.
- *Easy Orthogonal Building* shortcut now implements batch orthogonal building
  creation. It is backward compatible.

### Fixed
- Batch buildings creation, [issue #11].

## [0.2.0] - 2017-09-17
### Added
- Script for creating orthogonal building based on the click to the middle of
  the building.
- Script for creating residential area and buildings inside it by clicking to
  the middle of the buildings.

### Fixed
- Missing API documentation links in [README].

## [0.1.0] - 2017-09-13
### Added
- API documentation.

### Changed
- Follow [Semantic Versioning].
- API in scripts.
- Function names in scripts.
- Rename `easy_autoresidential` to `pick_residential`.

### Fixed
- Tile border overflow, [issue #1].

## [0.0.3] - 2017-09-09
### Changed
- [Credits](./doc/credits.md) to separate file in `doc` folder.
- User documentation to separate folder.

### Fixed
- Function that returns index of circle building dimension.
- Function that returns matrix containing votes.
- Creation of working image `wimg` on tile borders.

## [0.0.2] - 2017-08-28
### Added
- Credits information to scripts.
- Auxiliary python script for building dimensions histogram generation.
- Script for creating circle building based on the click to the middle of the
  building.

## [0.0.1] - 2017-08-09
### Added
- License (added in initial commit).
- Scripts for easier creating of square and circle buildings and residential
  areas.
- Script for automatically creating residential area around selected buildings.

### Changed
- Reformat [README] file to correspond to changelog file.

[Unreleased]: https://github.com/qeef/josm-scripts/compare/v0.3.3...HEAD
[0.3.3]: https://github.com/qeef/josm-scripts/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/qeef/josm-scripts/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/qeef/josm-scripts/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/qeef/josm-scripts/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/qeef/josm-scripts/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/qeef/josm-scripts/compare/v0.0.3...v0.1.0
[0.0.3]: https://github.com/qeef/josm-scripts/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/qeef/josm-scripts/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/qeef/josm-scripts/compare/d72f585...v0.0.1

[issue #1]: https://github.com/qeef/josm-scripts/issues/1
[issue #11]: https://github.com/qeef/josm-scripts/issues/11

[Semantic Versioning]: http://semver.org/
[Keep a Changelog]: http://keepachangelog.com/

[README]: README.md
