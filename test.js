'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var File = require('vinyl');
var assert = require('assert');
var syncBower = require('./');

describe('gulp-sync-bower', function() {
  it('should sync package.json with bower.json', function(cb) {
    var stream = syncBower();
    var files = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/bower.json',
      contents: new Buffer(JSON.stringify({}))
    }));

    stream.on('data', function(file) {
      files.push(file);
    });

    stream.on('end', function() {
      assert(files[0]);
      assert(files[0].contents.toString());
      var bower = JSON.parse(files[0].contents);
      assert.equal(bower.name, 'gulp-sync-bower');
      assert.deepEqual(bower.authors, [
        'Jon Schlinkert (https://github.com/jonschlinkert)'
      ]);
      cb();
    });

    stream.end();
  });

  it('should use the package.json passed on options', function(cb) {
    var stream = syncBower({
      pkg: {
        name: 'foo',
        author: 'Jon S'
      }
    });
    var files = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/bower.json',
      contents: new Buffer(JSON.stringify({}))
    }));

    stream.on('data', function(file) {
      files.push(file);
    });

    stream.on('end', function() {
      assert(files[0]);
      assert(files[0].contents.toString());
      var bower = JSON.parse(files[0].contents);
      assert.equal(bower.name, 'foo');
      assert.deepEqual(bower.authors, ['Jon S']);
      cb();
    });

    stream.end();
  });

  it('should use the cwd passed on options', function(cb) {
    var stream = syncBower({cwd: path.join(__dirname, 'fixtures')});
    var files = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/bower.json',
      contents: new Buffer(JSON.stringify({}))
    }));

    stream.on('data', function(file) {
      files.push(file);
    });

    stream.on('end', function() {
      assert(files[0]);
      assert(files[0].contents.toString());
      var bower = JSON.parse(files[0].contents);
      assert.equal(bower.name, 'fixtures');
      assert.deepEqual(bower.authors, ['JPS']);
      cb();
    });

    stream.end();
  });
});
