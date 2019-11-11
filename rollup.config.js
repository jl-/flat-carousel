module.exports = {
    input: 'src/index.tsx',
    output: {
      file: 'build/index.js',
      format: 'cjs'
    },
    plugins: [
        require('rollup-plugin-scss')(),
        require('rollup-plugin-typescript')(),
        require('rollup-plugin-uglify').uglify()
    ]
};