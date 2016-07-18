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

'use strict';

const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const PassThroughStream = require('stream').PassThrough;
const lzma = Bluebird.promisifyAll(require('lzma-native'));
const zlib = require('zlib');
const unbzip2Stream = require('unbzip2-stream');
const archive = require('./archive');
const zipArchiveHooks = require('./archive-hooks/zip');

/**
 * @summary Image handlers
 * @namespace handlers
 * @public
 */
module.exports = {

  /**
   * @summary Handle BZ2 compressed images
   * @function
   * @public
   * @memberof handlers
   *
   * @param {String} file - file path
   * @fulfil {Object} - image metadata
   * @returns {Promise}
   */
  'application/x-bzip2': function(file) {
    return Bluebird.props({
      stream: fs.createReadStream(file),
      size: fs.statAsync(file).get('size'),
      transform: Bluebird.resolve(unbzip2Stream())
    });
  },

  /**
   * @summary Handle GZ compressed images
   * @function
   * @public
   * @memberof handlers
   *
   * @param {String} file - file path
   * @fulfil {Object} - image metadata
   * @returns {Promise}
   */
  'application/gzip': function(file) {
    return Bluebird.props({
      stream: fs.createReadStream(file),
      size: fs.statAsync(file).get('size'),
      transform: Bluebird.resolve(zlib.createGunzip())
    });
  },

  /**
   * @summary Handle XZ compressed images
   * @function
   * @public
   * @memberof handlers
   *
   * @param {String} file - file path
   * @fulfil {Object} - image metadata
   * @returns {Promise}
   */
  'application/x-xz': function(file) {
    return fs.openAsync(file, 'r').then((fileDescriptor) => {
      return lzma.parseFileIndexFDAsync(fileDescriptor).tap(() => {
        return fs.closeAsync(fileDescriptor);
      });
    }).then((metadata) => {
      return {
        stream: fs.createReadStream(file)
          .pipe(lzma.createDecompressor()),
        size: metadata.uncompressedSize,
        transform: new PassThroughStream()
      };
    });
  },

  /**
   * @summary Handle ZIP compressed images
   * @function
   * @public
   * @memberof handlers
   *
   * @param {String} file - file path
   * @fulfil {Object} - image metadata
   * @returns {Promise}
   */
  'application/zip': function(file) {
    return archive.extractImage(file, zipArchiveHooks);
  },

  /**
   * @summary Handle plain uncompressed images
   * @function
   * @public
   * @memberof handlers
   *
   * @param {String} file - file path
   * @fulfil {Object} - image metadata
   * @returns {Promise}
   */
  'application/octet-stream': function(file) {
    return Bluebird.props({
      stream: fs.createReadStream(file),
      size: fs.statAsync(file).get('size'),
      transform: Bluebird.resolve(new PassThroughStream())
    });
  }

};
