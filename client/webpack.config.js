module.exports = {
  "resolve": {
    "fallback": { 
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"), 
      "http": require.resolve("stream-http"), 
      "https": require.resolve("stream-http"),
      "path": require.resolve('path-browserify'),
      "vm": require.resolve('vm-browserify'),
    },
    "disableFallback": { 
      "stream": false, 
      "crypto": false, 
      "http": false, 
      "https": false,
      "fs": false,
    }
  }
};