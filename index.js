var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-use-asset';

function gulpUseAsset() {
  var stream = through.obj(function(file, enc, callback) {
    var buffer = file.contents.toString(),
        lines = buffer.toString().split('\n'),
        startBlock  = /<!--\s*use:\s*(js|css)\s*.*\s+-->/igm,
        endBlock  = /<!--\s*enduse\s*-->/igm,
        templates = {
          js: '<scrpt src="*"></script>',
          css: '<link href="*" type="text/css" rel="stylesheet />"'
        },
        toStrip = [];

    var strpObj = {};

    for(var i=0; i<lines.length; i++) {

      if(lines[i].match(startBlock)) {
        if(!strpObj.start) {
          strpObj.start = i;
          strpObj.type = (lines[i].match('js'))? 'js' : 'css';
          strpObj.path = lines[i].match(/\b[^a-z:a-z][.\/a-zA-Z09]*\w/)[0].trim(); // This will need to be better;
        } else {
          throw new PluginError(PLUGIN_NAME, 'Line: '+lines[strpObj.start] +' has no <!-- enduse -->');
        }
      }

      if(lines[i].match(endBlock)) {
        if(!strpObj.start) {
          throw new PluginError(PLUGIN_NAME, 'Line: '+lines[i] +' has no prefeacing <!-- use:* --> entry'); 
        } else {
          strpObj.end = i;
          toStrip.push(strpObj);
          strpObj = {};
        }
      }
    }

    for(var i=0; i<toStrip.length; i++) {
      lines.splice(toStrip[i].start, ((toStrip[i].end + 1) - toStrip[i].start), templates[toStrip[i].type].replace('*', toStrip[i].path))
    };

    lines = lines.join('\n');
    
    file.contents = new Buffer(String(lines));

    console.log(file.contents.toString());
    this.push(file);

    callback();
  });

  return stream;
};

module.exports = gulpUseAsset;