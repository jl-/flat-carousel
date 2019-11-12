module.exports = {
    input: 'src/index.tsx',
    output: {
      file: 'build/index.js',
      format: 'cjs',
    },
    plugins: [
        require('rollup-plugin-typescript')(),
        require('rollup-plugin-sass')({ output: true, insert: true }),
        require('rollup-plugin-uglify').uglify({
          // mangle: { toplevel: true }
        }),
        require('rollup-plugin-filesize')()
    ],
    external: [
      'react'
    ]
};