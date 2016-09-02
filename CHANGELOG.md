# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [v4.0.0] - 2016-09-02

### Added

- Add `supportUrl` property in `_info/manifest.json`.
- Add `releaseNotesUrl` property in `_info/manifest.json`.
- Add `version` property in `_info/manifest.json`.
- Add `checksum` and `checksumType` properties in `_info/manifest.json`.

### Removed

- Remove `estimatedSize` property from `.getImageMetatada()` results.

## [v3.1.2] - 2016-08-24

### Changed

- Fix incorrect estimated entry sizes in certain ZIP archives.

## [v3.1.1] - 2016-08-22

### Changed

- Improve speed when retrieving archive metadata.

## [v3.1.0] - 2016-08-15

### Added

- Support a `.bmap` file inside the `_info` metadata directory.

## [v3.0.1] - 2016-07-25

### Changed

- Rename `.getImageMetatada()` to `.getImageMetadata()` (typo).

## [v3.0.0] - 2016-07-25

### Added

- Implement `.getImageMetatada()`.

### Removed

- Remove `.getEstimatedFinalSize()`.

## [v2.6.1] - 2016-07-24

### Changed

- Move from `unzip2` to `yauzl` for decompressing Zip archives.

## [v2.6.0] - 2016-07-24

### Added

- Add `raw` support.

## [v2.5.2] - 2016-07-19

### Changed

- Unlock `lzma-native` version.

## [v2.5.1] - 2016-07-19

### Changed

- Lock `lzma-native` to v1.4.1 given errors on Electron.

## [v2.5.0] - 2016-07-18

### Added

- Implement `.getEstimatedFinalSize()`.

## [v2.4.0] - 2016-07-11

### Added

- Add support for an `_info/manifest.json` in archive images.
- Add support for specifying a logo as `_info/logo.svg` in archive images.

## [v2.3.0] - 2016-07-01

### Added

- Add `hddimg` support.

## [v2.2.0] - 2016-06-21

### Added

- Add `dsk` support.

## [v2.1.0] - 2016-06-20

### Changed

- Set `zip` supported format type to `archive`.

## [v2.0.0] - 2016-05-19

### Added

- Add `gz` support.
- Add `bz2` support.

### Changed

- Extend `.supportedFileTypes` with metadata about the supported file types.

## [v1.2.0] - 2016-04-28

### Added

- Add support for Zip image directories.

## [v1.1.0] - 2016-04-27

### Added

- Export supported file types as `.supportedFileTypes`.

## [v1.0.1] - 2016-04-27

### Changed

- Don't ignore `lib/` in NPM package.

[v4.0.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v3.1.2...v4.0.0
[v3.1.2]: https://github.com/resin-io-modules/etcher-image-stream/compare/v3.1.1...v3.1.2
[v3.1.1]: https://github.com/resin-io-modules/etcher-image-stream/compare/v3.1.0...v3.1.1
[v3.1.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v3.0.1...v3.1.0
[v3.0.1]: https://github.com/resin-io-modules/etcher-image-stream/compare/v3.0.0...v3.0.1
[v3.0.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.6.1...v3.0.0
[v2.6.1]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.6.0...v2.6.1
[v2.6.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.5.2...v2.6.0
[v2.5.2]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.5.1...v2.5.2
[v2.5.1]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.5.0...v2.5.1
[v2.5.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.4.0...v2.5.0
[v2.4.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.3.0...v2.4.0
[v2.3.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.2.0...v2.3.0
[v2.2.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.1.0...v2.2.0
[v2.1.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v2.0.0...v2.1.0
[v2.0.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v1.2.0...v2.0.0
[v1.2.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v1.1.0...v1.2.0
[v1.1.0]: https://github.com/resin-io-modules/etcher-image-stream/compare/v1.0.1...v1.1.0
[v1.0.1]: https://github.com/resin-io-modules/etcher-image-stream/compare/v1.0.0...v1.0.1
