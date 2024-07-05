const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact({
    // Uncomment this line if you don't want to use SVGR
    // See: https://react-svgr.com/
    // svgr: false
  }),
  (config) => {
    config.devServer = {
      host: process.env['DEFAULT_HOST'] || 'localhost',
      port: process.env['PORT_FRONT_PURE_TV'] || 4200,
      historyApiFallback: true,
    };
    return config;
  }
);
