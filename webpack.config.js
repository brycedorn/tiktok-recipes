const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const url = 'https://bryce.io/tiktok-recipes';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		extensions: ['.js', '.svelte']
	},
	output: {
		path: __dirname + '/public',
		publicPath: prod ? url : '/',
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
			image: `${url}/taco.png`,
			url,
			template: 'src/index.html',
			favicon: 'src/taco.png'
		})
	],
	devtool: prod ? false: 'source-map'
};
