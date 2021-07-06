const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const baseUrl = 'https://bryce.io/';
const path = 'tiktok-recipes';

module.exports = {
	entry: {
		bundle: ['./web/main.js']
	},
	resolve: {
		extensions: ['.js', '.svelte']
	},
	output: {
		path: __dirname + '/public',
		publicPath: prod ? `${baseUrl}${path}` : '/',
		filename: prod ? '[name].[hash].js' : '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			},
			{
        test: /\.(png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
			{
        test: /\.txt$/i,
        use: 'raw-loader',
      }
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: prod ? '[name].[hash].css' : '[name].css'
		}),
		new HtmlWebpackPlugin({
			title: 'My Liked TikTok Recipes',
			description: 'Organizing recipes I\'ve come across so I can make them!',
			image: `${baseUrl}${path}/bento.png`,
			url: `${baseUrl}${path}`,
			template: 'web/index.html',
			favicon: 'web/bento.png'
		})
	],
	devtool: prod ? false: 'source-map'
};
