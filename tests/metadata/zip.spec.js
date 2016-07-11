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
const path = require('path');
const DATA_PATH = path.join(__dirname, '..', 'data');
const IMAGES_PATH = path.join(DATA_PATH, 'images');
const ZIP_PATH = path.join(DATA_PATH, 'metadata', 'zip');
const tester = require('../tester');
const imageStream = require('../../lib');

describe('EtcherImageStream: Metadata ZIP', function() {

  this.timeout(10000);

  describe('given an archive with an invalid `manifest.json`', function() {

    const archive = path.join(ZIP_PATH, 'rpi-invalid-manifest.zip');

    tester.expectError(
      path.join(ZIP_PATH, 'rpi-invalid-manifest.zip'),
      'Invalid archive manifest.json');

  });

  describe('given an archive with a `manifest.json`', function() {

    const archive = path.join(ZIP_PATH, 'rpi-with-manifest.zip');

    tester.extractFromFilePath(
      archive,
      path.join(IMAGES_PATH, 'raspberrypi.img'));

    it('should read the manifest name property', function(done) {
      imageStream.getFromFilePath(archive).then((image) => {
        m.chai.expect(image.name).to.equal('Raspberry Pi');
        done();
      });
    });

    it('should read the manifest url property', function(done) {
      imageStream.getFromFilePath(archive).then((image) => {
        m.chai.expect(image.url).to.equal('https://www.raspberrypi.org');
        done();
      });
    });

  });

});
