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
const lzma = require('lzma-native');

/**
 * @summary Image handlers
 * @namespace handlers
 * @public
 */
module.exports = {

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
    return Bluebird.props({
      stream: fs.createReadStream(file),
      size: fs.statAsync(file).get('size'),
      transform: Bluebird.resolve(lzma.createDecompressor())
    });
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
