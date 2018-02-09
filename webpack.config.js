const WebpackConfig = require('webpack-config');

const environment = WebpackConfig.environment;
const Config = WebpackConfig.Config;

environment.setAll({
    task: () => process.env.TASK,
});

// Depending on the task at hand, we use a different webpack configuration file.
const configurationFile = `configuration/webpack.config.${process.env.TASK}.js`;

module.exports = new Config().extend(configurationFile);
