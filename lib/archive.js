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
const Bluebird = require('bluebird');
const rindle = require('rindle');
const _ = require('lodash');
const PassThroughStream = require('stream').PassThrough;
const supportedFileTypes = require('./supported');

/**
 * @summary Image extensions
 * @constant
 * @private
 * @type {String[]}
 */
const IMAGE_EXTENSIONS = _.reduce(supportedFileTypes, (accumulator, file) => {
  if (file.type === 'image') {
    accumulator.push(file.extension);
  }

  return accumulator;
}, []);

/**
 * @summary Extract entry by path
 * @function
 * @private
 *
 * @param {String} archive - archive
 * @param {String} filePath - entry file path
 * @param {Object} options - options
 * @param {Object} options.hooks - archive hooks
 * @param {Object[]} options.entries - archive entries
 * @param {*} [options.default] - entry default value
 * @fulfil {*} contents
 * @returns {Promise}
 *
 * extractEntryByPath('my/archive.zip', '_info/logo.svg', {
 *   hooks: { ... },
 *   entries: [ ... ],
 *   default: ''
 * }).then((contents) => {
 *   console.log(contents);
 * });
 */
const extractEntryByPath = (archive, filePath, options) => {
  const fileEntry = _.find(options.entries, (entry) => {
    return _.chain(entry.name)
      .split('/')
      .tail()
      .join('/')
      .value() === filePath;
  });

  if (!fileEntry) {
    return Bluebird.resolve(options.default);
  }

  return options.hooks.extractFile(archive, options.entries, fileEntry.name)
    .then(rindle.extract);
};

/**
 * @summary Extract image from archive
 * @function
 * @public
 *
 * @param {String} archive - archive path
 * @param {Object} hooks - archive hooks
 * @param {Function} hooks.getEntries - get entries hook
 * @param {Function} hooks.extractFile - extract file hook
 * @fulfil {Object} image metadata
 * @returns {Promise}
 *
 * @example
 * archive.extractImage('path/to/my/archive.zip', {
 *   getEntries: (archive) => {
 *     return [ ..., ..., ... ];
 *   },
 *   extractFile: (archive, entries, file) => {
 *     ...
 *   }
 * }).then((image) => {
 *   image.stream.pipe(image.transform).pipe(...);
 * });
 */
exports.extractImage = (archive, hooks) => {
  return hooks.getEntries(archive).then((entries) => {

    const imageEntries = _.filter(entries, (entry) => {
      const extension = path.extname(entry.name).slice(1);
      return _.includes(IMAGE_EXTENSIONS, extension);
    });

    if (imageEntries.length !== 1) {
      throw new Error('Invalid archive image');
    }

    const imageEntry = _.first(imageEntries);

    return Bluebird.props({
      imageStream: hooks.extractFile(archive, entries, imageEntry.name),
      logo: extractEntryByPath(archive, '_info/logo.svg', {
        hooks,
        entries
      }),
      bmap: extractEntryByPath(archive, '_info/image.bmap', {
        hooks,
        entries
      }),
      manifest: _.attempt(() => {
        return extractEntryByPath(archive, '_info/manifest.json', {
          hooks,
          entries,
          default: '{}'
        }).then((manifest) => {
          try {
            return JSON.parse(manifest);
          } catch (error) {
            throw new Error('Invalid archive manifest.json');
          }
        });
      })
    }).then((results) => {
      return {
        stream: results.imageStream,
        size: imageEntry.size,
        name: results.manifest.name,
        version: results.manifest.version,
        url: results.manifest.url,
        supportUrl: results.manifest.supportUrl,
        releaseNotesUrl: results.manifest.releaseNotesUrl,
        checksumType: results.manifest.checksumType,
        checksum: results.manifest.checksum,
        logo: results.logo,
        bmap: results.bmap,
        transform: new PassThroughStream()
      };
    });
  });
};
