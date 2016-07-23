# webpack-renamechunk-plugin
a webpack chunk that allows you to rename a chunk file name to be created, while keeping the chunkFilename option works in the compiled entries.

for example, we need a hash in the splitted chunks, like:

```js
https://xxx.yyy.com/dist/js/1/main.bd6d67da6fa30bd880f8.js
```

but when we configure chunkFilename in the output options, we also get a complied chunk file 1/main.bd6d67da6fa30bd880f8.js under dist/js/. This may generate many temporary files that we don't want. What we want is a fixed-name file like dist/js/1/main.js, and the rewrite rule should be handled by nginx or apache, etc.


# usage
this plugin check a new configuration option 'renameChunkFileName' in output. If chunkFilename and renameChunkFileName are both configured, the plugin hooks the emit procedure, find the chunks to be created as file, and rename them with 'renameChunkFileName' format.

First, import this plugin

```js
var WebpackRenameChunkPlugin = require('webpack-renamechunk-plugin');
```

Second, configure renameChunkFileName

```js
output: {
  // Where to build results
  path: __dirname + '/static/dist/js/',

  // compile file path, for chunks
  publicPath: '/static/dist/js/',

  // chunk file name to be required in entry files
  chunkFilename: 'console/[id]/main.[hash].js',

  // chunk file name to be created actually
  renameChunkFileName: 'console/[id]/main.js'
}
```

At last, we add it in plugin list

```js
plugins: [
  new WebpackRenameChunkPlugin()
]
```
