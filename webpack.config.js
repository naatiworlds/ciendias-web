const webpack = require('webpack');

module.exports = {
  // Otra configuración
  plugins: [
    new webpack.DefinePlugin({
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),
      // Aquí puedes definir otras feature flags necesarias
    })
  ]
};
