/***********************************************************************************************************************************************
 * GULP USE ASSET
 ***********************************************************************************************************************************************
 * @description Removes uneccesary build steps by simply referencing file paths that have already been built.
 */
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// WHY ARE WE YELLING?
const PLUGIN_NAME = 'gulp-use-asset';


/**
 * GULP USE ASSET
 * 
 * @description Wrapper for the stream object.
 * @return {[type]} [description]
 */
function gulpUseAsset() {

  // Create stream.
  var stream = through.obj(function(file, enc, callback) {
    // Closure members.
    var buffer = file.contents.toString(), // Stringify
        lines = buffer.toString().split('\n'), // Lineify
        startBlock  = /<!--\s*use:\s*(js|css)\s*.*\s+-->/igm, // Find <!-- use blocks
        endBlock  = /<!--\s*enduse\s*-->/igm, // Find <!-- end blocks
        templates = {
          js: '<script src="*"></script>', // JS template
          css: '<link href="*" type="text/css" rel="stylesheet" />' // CSS template
        },
        toStrip = []; // Holds references to the groups that need replacing.

    // Per-iteration member that gets filled with use block data.
    var strpObj = {};

    // Check each line.
    for(var i=0; i<lines.length; i++) {

      // Start block found
      if(lines[i].match(startBlock)) {
        if(!strpObj.start) {
          strpObj.start = i; // Hold reference to starting line
          strpObj.type = (lines[i].match('js'))? 'js' : 'css'; // Template type
          strpObj.path = lines[i].match(/\b[^a-z:a-z][.\/a-zA-Z09]*\w/)[0].trim(); // File Path
        } else {
          // This will catch if there's two start blocks before an end block.
          // This means it DOES NOT SUPPORT:
          // <!-- use:* -->
          //   <!-- use:* -->
          //   <!-- enduse -->
          // <!-- enduse -->
          throw new PluginError(PLUGIN_NAME, 'Line: '+lines[strpObj.start] +' has no <!-- enduse -->');
        }
      }

      // If line is a match block.
      if(lines[i].match(endBlock)) {
        if(!strpObj.start) {
          // Throw if not start use found, see above comment.
          throw new PluginError(PLUGIN_NAME, 'Line: '+lines[i] +' has no prefeacing <!-- use:* --> entry'); 
        } else {
          strpObj.end = i; // Line reference
          toStrip.push(strpObj); // Push to our per-file reference of how many blocks to strip
          strpObj = {}; // Clear our per-iteration reference.
        }
      }
    }

    // Now process toStrip
    for(var i=0; i<toStrip.length; i++) {
      // Splice it up.
      lines.splice(toStrip[i].start, ((toStrip[i].end + 1) - toStrip[i].start), templates[toStrip[i].type].replace('*', toStrip[i].path))
    };

    // Re-join lines with line-breaks.
    // This is NOT an htmlmin library.
    lines = lines.join('\n');
    
    // Return to file contents.
    file.contents = new Buffer(String(lines));

    // Send file to next pipe.
    this.push(file);

    // Keep on pipin'
    callback();
  });

  // Return stream object for the pipe chain.
  return stream;
};

// Enables .pipe(useAsset())
module.exports = gulpUseAsset;
