const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const PATHS = {
  src: path.join(__dirname, 'src')
}

module.exports = {
	entry: {
		'build/bundle': ['./src/main.js']
	},

	resolve: {
		alias: {
			svelte: path.dirname(require.resolve('svelte/package.json')),
			'@': path.resolve(__dirname, 'src')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'build/file-template-editor.js',
		library: 'FileTemplateEditor',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: !prod
						},
						emitCss: prod,
						hotReload: !prod
					}
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			},
			{
				test: /\.(sc|sa|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									require('autoprefixer')({
										overrideBrowserslist: ['last 5 version', '>1%', 'ios 7']
									})
								]
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				// required to prevent errors from Svelte on Webpack 5+
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'build/file-template-editor.css'
		}),
		new PurgecssPlugin({
       paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
       variables: true,
       safelist: ['body']
    }),
	],
	devtool: prod ? false : 'source-map',
	devServer: {
		hot: true
	}
};
