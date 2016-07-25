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
const fs = require('fs');
const path = require('path');
const DATA_PATH = path.join(__dirname, 'data');
const IMAGES_PATH = path.join(DATA_PATH, 'images');
const GZ_PATH = path.join(DATA_PATH, 'gz');
const imageStream = require('../lib/index');
const tester = require('./tester');

describe('EtcherImageStream: GZ', function() {

  this.timeout(10000);

  describe('.getFromFilePath()', function() {

    describe('given a gz image', function() {
      tester.extractFromFilePath(
        path.join(GZ_PATH, 'raspberrypi.img.gz'),
        path.join(IMAGES_PATH, 'raspberrypi.img'));
    });

  });

  describe('.getImageMetatada()', function() {

    it('should return the correct metadata', function(done) {
      const image = path.join(GZ_PATH, 'raspberrypi.img.gz');
      const expectedSize = fs.statSync(path.join(IMAGES_PATH, 'raspberrypi.img')).size;

      imageStream.getImageMetatada(image).then((metadata) => {
        m.chai.expect(metadata).to.deep.equal({
          estimatedSize: expectedSize
        });
        done();
      });
    });

  });

});
