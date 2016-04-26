etcher-image-stream
===================

> Get a readable stream from any type of OS image

[![npm version](https://badge.fury.io/js/etcher-image-stream.svg)](http://badge.fury.io/js/etcher-image-stream)
[![dependencies](https://david-dm.org/resin-io-modules/etcher-image-stream.svg)](https://david-dm.org/resin-io-modules/etcher-image-stream.svg)
[![Build Status](https://travis-ci.org/resin-io-modules/etcher-image-stream.svg?branch=master)](https://travis-ci.org/resin-io-modules/etcher-image-stream)
[![Build status](https://ci.appveyor.com/api/projects/status/dv96q5gd4nihuh83/branch/master?svg=true)](https://ci.appveyor.com/project/resin-io/etcher-image-stream/branch/master)

Installation
------------

Install `etcher-image-stream` by running:

```sh
$ npm install --save etcher-image-stream
```

Documentation
-------------

<a name="module_imageStream.getFromFilePath"></a>

### imageStream.getFromFilePath(file) ⇒ <code>Promise</code>
This function resolves an object containing the following properties:

- `Number size`: The input file size.

- `ReadableStream stream`: The input file stream.

- `TransformStream transform`: A transform stream that performs any
needed transformation to get the image out of the source input file
(for example, decompression).

The purpose of separating the above components is to handle cases like
showing a progress bar when you can't know the final uncompressed size.

In such case, you can pipe the `stream` through a progress stream using
the input file `size`, and apply the `transform` after the progress stream.

**Kind**: static method of <code>[imageStream](#module_imageStream)</code>  
**Summary**: Get an image stream from a file  
**Access:** public  
**Fulfil**: <code>Object</code> - image stream details  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | file path |

**Example**  
```js
const imageStream = require('etcher-image-stream');

imageStream.getFromFilePath('path/to/rpi.img.xz').then(function(image) {
  image.stream
    .pipe(image.transform)
    .pipe(fs.createWriteStream('/dev/disk2'));
});
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/resin-io-modules/etcher-image-stream/issues/new) on GitHub and the Resin.io team will be happy to help.

Tests
-----

Run the test suite by doing:

```sh
$ npm test
```

Contribute
----------

- Issue Tracker: [github.com/resin-io-modules/etcher-image-stream/issues](https://github.com/resin-io-modules/etcher-image-stream/issues)
- Source Code: [github.com/resin-io-modules/etcher-image-stream](https://github.com/resin-io-modules/etcher-image-stream)

Before submitting a PR, please make sure that you include tests, and that [jshint](http://jshint.com) runs without any warning:

```sh
$ npm run lint
```

License
-------

`etcher-image-stream` is free software, and may be redistributed under the terms specified in the [license](https://github.com/resin-io-modules/etcher-image-stream/blob/master/LICENSE).
