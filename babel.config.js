const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  minified: isProduction,
  comments: !isProduction,
  presets: [
    ['@babel/env', {
      
    }],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'inline-react-svg',
      {
        svgo: {
          plugins: [
            { removeScriptElement: true },
            { removeViewBox: false },
            /* Remove unused attrs produced by the editing software. `removeAttrs` syntax: https://goo.gl/YLuuEU */
            {
              removeAttrs: {
                attrs: ['serif.id', 'xmlns.serif', 'data.name'],
              },
            },
          ],
        },
      },
    ],
  ],
}
