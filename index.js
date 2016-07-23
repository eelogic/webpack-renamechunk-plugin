// plugin definition
var RenameChunkPlugin = function(options) {};

// determine wheter a chunk is a splitted chunk
// a splitted chunk is unnamed, not an entry and not initial
RenameChunkPlugin.prototype.isSplitChunk = function(chunk) {
  return !chunk.name && !chunk.entry && !chunk.initial;
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
  var splitChunks = compilation.chunks.filter(function(chunk) {
    return this.isSplitChunk(chunk);
  }.bind(this));

  // rename assets files
  var assets = compilation.assets;
  var format = opts.renameChunkFileName;
  var filename, formatName, chunk;
  for (filename in assets) {
    chunk = this.getChunkByFilename(splitChunks, filename);
    if (chunk) {
      formatName = format.replace(/\[id\]/g, String(chunk.id))
        .replace(/\[name\]/g, chunk.name)
        .replace(/\[hash\]/g, compilation.hash)
        .replace(/\[chunkhash\]/g, chunk.hash);
      assets[formatName] = assets[filename];
      delete assets[filename];
    }
  }
};

// plugin procedure
RenameChunkPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    var opts = compiler.options.output;
    var chunkFilename = opts && opts.chunkFilename;
    var renameChunkFileName = opts && opts.renameChunkFileName;

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
