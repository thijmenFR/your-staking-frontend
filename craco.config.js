const CracoAntDesignPlugin = require('craco-antd');
const sassResourcesLoader = require('craco-sass-resources-loader');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const CracoAlias = require('craco-alias');

const path = require('path');

module.exports = () => ({
  webpack: {
    plugins: [new AntdDayjsWebpackPlugin()],
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(__dirname, 'src/assets/styles/theme/antd-variables.less'),
      },
    },
    {
      plugin: sassResourcesLoader,
      options: {
        resources: ['./src/assets/styles/_vars.scss', './src/assets/styles/theme/_mixins.scss'],
      },
    },
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: '.',
        tsConfigPath: './tsconfig.extend.json',
      },
    },
  ],
});
