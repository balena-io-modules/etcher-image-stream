/*
 * Copyright 2016 Resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @module imageStream
 */

'use strict';

const Bluebird = require('bluebird');
const utils = require('./utils');
const handlers = require('./handlers');
const supportedFileTypes = require('./supported');

/**
 * @summary Get an image stream from a file
 * @function
 * @public
 *
 * @description
 * This function resolves an object containing the following properties:
 *
 * - `Number size`: The input file size.
 *
 * - `ReadableStream stream`: The input file stream.
 *
 * - `TransformStream transform`: A transform stream that performs any
 * needed transformation to get the image out of the source input file
 * (for example, decompression).
 *
 * The purpose of separating the above components is to handle cases like
 * showing a progress bar when you can't know the final uncompressed size.
 *
 * In such case, you can pipe the `stream` through a progress stream using
 * the input file `size`, and apply the `transform` after the progress stream.
 *
 * @param {String} file - file path
 * @fulfil {Object} - image stream details
 * @returns {Promise}
 *
 * @example
 * const imageStream = require('etcher-image-stream');
 *
 * imageStream.getFromFilePath('path/to/rpi.img.xz').then(function(image) {
 *   image.stream
 *     .pipe(image.transform)
 *     .pipe(fs.createWriteStream('/dev/disk2'));
 * });
 */
exports.getFromFilePath = function(file) {
  return Bluebird.try(function() {
    const type = utils.getArchiveMimeType(file);

    if (!handlers[type]) {
      throw new Error('Invalid image');
    }

    return handlers[type](file);
  });
};

/**
 * @summary Get the estimated final size from image
 * @function
 * @public
 *
 * @description
 * This function is useful to determine the final size of an image
 * after decompression or any other needed transformation.
 *
 * **NOTE:** This function is known to output incorrect results for
 * `bzip2`. For this compression format, this function will simply
 * return the size of the compressed file.
 *
 * @param {String} file - file path
 * @fulfil {Number} - estimated final size
 * @returns {Promise}
 *
 * @example
 * const imageStream = require('etcher-image-stream');
 *
 * imageStream.getEstimatedFinalSize('path/to/rpi.img.xz').then(function(estimatedSize) {
 *   console.log(`The estimated final size is: ${estimatedSize}`);
 * });
 */
exports.getEstimatedFinalSize = function(file) {
  return exports.getFromFilePath(file).then(function(image) {
    return image.estimatedUncompressedSize || image.size;
  });
};

/**
 * @summary Supported file types
 * @type {String[]}
 * @public
 *
 * @example
 * const imageStream = require('etcher-image-stream');
 *
 * imageStream.supportedFileTypes.forEach(function(fileType) {
 *   console.log('Supported file type: ' + fileType.extension);
 * });
 */
exports.supportedFileTypes = supportedFileTypes;
