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
const fs = require('fs');
const _ = require('lodash');
const AdmZip = require('adm-zip');
const unzip = require('unzip2');

/**
 * @summary Get all archive entries
 * @function
 * @public
 *
 * @param {String} archive - archive path
 * @returns {Object[]} archive entries
 *
 * @example
 * const entries = zip.getEntries('path/to/my.zip');
 *
 * entries.forEach((entry) => {
 *   console.log(entry.name);
 *   console.log(entry.size);
 * });
 */
exports.getEntries = (archive) => {
  const admZip = new AdmZip(archive);

  return _.chain(admZip.getEntries())
    .reject((entry) => {
      return _.some([
        entry.name === '.',
        entry.name === '',
        entry.size === 0
      ]);
    })
    .map((entry) => {
      return {
        name: entry.entryName,
        size: entry.header.size
      };
    })
    .value();
};

/**
 * @summary Extract a file from an archive
 * @function
 * @public
 *
 * @param {String} archive - archive path
 * @param {String} file - archive file
 * @fulfil {ReadableStream} file
 * @returns {Promise}
 *
 * @example
 * zip.extractFile('path/to/my.zip', 'my/file').then((stream) => {
 *   stream.pipe('...');
 * });
 */
exports.extractFile = (archive, file) => {
  return new Bluebird((resolve, reject) => {
    const entries = exports.getEntries(archive);

    if (!_.find(entries, {
      name: file
    })) {
      throw new Error(`Invalid entry: ${file}`);
    }

    fs.createReadStream(archive)
      .pipe(unzip.Parse())
      .on('error', reject)
      .on('entry', (entry) => {
        if (entry.type === 'File' && entry.path === file) {
          return resolve(entry);
        }

        entry.autodrain();
      });
  });
};
