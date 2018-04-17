// plugin definition
var RenameChunkPlugin = function(options) {
  this.options = options;
};

// determine wheter a chunk is a splitted chunk
// a splitted chunk is unnamed, not an entry and not initial
RenameChunkPlugin.prototype.isSplitChunk = function(chunk) {
  try{
    // only support in webpack v1
    return !chunk.name && !chunk.entry && !chunk.initial;
  }
  catch (err){
    // compat with webpack 3+
    return !chunk.name && !chunk.hasEntryModule() && !chunk.canBeInitial();
  }
};

// get a trunk infomation given a filename
// a trunk may contain multiple files
RenameChunkPlugin.prototype.getChunkByFilename = function(chunks, filename) {
  var match = chunks.filter(function(chunk) {
    return chunk.files.indexOf(filename) > -1;
  });
  return match.length > 0 ? match[0] : null;
};

// reanme chunks handler
RenameChunkPlugin.prototype.renameChunks = function(compilation, opts) {
  // get split chunks
  var splitChunks = compilation.chunks.filter(this.isSplitChunk);

  // rename assets files
  var assets = compilation.assets;
  var format = opts.renameChunkFileName;
  var filename, formatName, chunk;
  for (filename in assets) {
    if(assets.hasOwnProperty(filename)){
      chunk = this.getChunkByFilename(splitChunks, filename);
      if (chunk) {
        formatName = format
          .replace(/\[id\]/g, String(chunk.id))
          .replace(/\[name\]/g, chunk.name)
          .replace(/\[hash\]/g, compilation.hash)
          .replace(/\[chunkhash\]/g, chunk.hash);
        assets[formatName] = assets[filename];
        delete assets[filename];
      }
    }
  }
};

// plugin procedure
RenameChunkPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    var opts = compiler.options.output;
    var chunkFilename = opts && opts.chunkFilename;

    // in webpack3+ output configuration not support custom prop like `renameChunkFileName`
    // but we still compat with webpack v1
    var renameChunkFileName = opts && opts.renameChunkFileName || this.options.renameChunkFileName;

    if (chunkFilename && renameChunkFileName) {
      this.renameChunks(compilation, {
        chunkFilename: chunkFilename,
        renameChunkFileName: renameChunkFileName
      });
    }

    callback();
  }.bind(this));
};

module.exports = RenameChunkPlugin;
