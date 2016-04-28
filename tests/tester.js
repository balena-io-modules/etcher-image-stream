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

const m = require('mochainon');
const _ = require('lodash');
const Bluebird = require('bluebird');
const fileExists = require('file-exists');
const fs = Bluebird.promisifyAll(require('fs'));
const tmp = require('tmp');
const rindle = require('rindle');
const imageStream = require('../lib/index');

function doFilesContainTheSameData(file1, file2) {
  return Bluebird.props({
    file1: fs.readFileAsync(file1),
    file2: fs.readFileAsync(file2)
  }).then(function(data) {
    return _.isEqual(data.file1, data.file2);
  });
}

function deleteIfExists(file) {
  return Bluebird.try(function() {
    if (fileExists(file)) {
      return fs.unlinkAsync(file);
    }
  });
}

exports.expectError = function(file, errorMessage) {
  it('should be rejected with an error', function() {
    const promise = imageStream.getFromFilePath(file);
    m.chai.expect(promise).to.be.rejectedWith(errorMessage);
  });
};

exports.extractFromFilePath = function(file, image) {
  it('should be able to extract the image', function(done) {
    const output = tmp.tmpNameSync();

    imageStream.getFromFilePath(file).then(function(results) {
      if (!_.some([
        results.size === fs.statSync(file).size,
        results.size === fs.statSync(image).size
      ])) {
        throw new Error('Invalid size: ' + results.size);
      }

      const stream = results.stream
        .pipe(results.transform)
        .pipe(fs.createWriteStream(output));

      return rindle.wait(stream);
    }).then(function() {
      return doFilesContainTheSameData(image, output);
    }).then(function(areEqual) {
      m.chai.expect(areEqual).to.be.true;
    }).finally(function() {
      return deleteIfExists(output);
    }).nodeify(done);
  });
};
