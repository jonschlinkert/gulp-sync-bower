'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var isObject = require('isobject');
var extend = require('extend-shallow');
var sync = require('sync-bower');

module.exports = function(options) {
  var opts = extend({cwd: process.cwd()}, options);
  var pkg = getPkg(opts);

  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    var bower = JSON.parse(file.contents);
    var obj = sync(pkg, bower, opts.options);
    file.contents = new Buffer(JSON.stringify(obj, null, 2));
    next(null, file);
  });
};

function getPkg(options) {
  if (isObject(options.pkg)) {
    return options.pkg;
  }

  var pkgFile = path.join(options.cwd, 'package.json');
  return JSON.parse(fs.readFileSync(pkgFile));
}
