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

const path = require('path');
const DATA_PATH = path.join(__dirname, 'data');
const IMAGES_PATH = path.join(DATA_PATH, 'images');
const ZIP_PATH = path.join(DATA_PATH, 'zip');
const tester = require('./tester');

describe('EtcherImageStream: ZIP', function() {

  this.timeout(10000);

  describe('given an empty zip directory', function() {
    tester.expectError(
      path.join(ZIP_PATH, 'zip-directory-empty.zip'),
      'Invalid zip image');
  });

  describe('given a zip directory containing only misc files', function() {
    tester.expectError(
      path.join(ZIP_PATH, 'zip-directory-no-image-only-misc.zip'),
      'Invalid zip image');
  });

  describe('given a zip directory containing multiple images', function() {
    tester.expectError(
      path.join(ZIP_PATH, 'zip-directory-multiple-images.zip'),
      'Invalid zip image');
  });

  describe('given a zip directory containing only an image', function() {
    tester.extractFromFilePath(
      path.join(ZIP_PATH, 'zip-directory-rpi-only.zip'),
      path.join(IMAGES_PATH, 'raspberrypi.img'));
  });

  describe('given a zip directory containing an image and other misc files', function() {
    tester.extractFromFilePath(
      path.join(ZIP_PATH, 'zip-directory-rpi-and-misc.zip'),
      path.join(IMAGES_PATH, 'raspberrypi.img'));
  });

});
