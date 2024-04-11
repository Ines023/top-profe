const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


// Fix for ERR_OSSL_EVP_UNSUPPORTED
const crypto = require('crypto');

// eslint-disable-next-line camelcase
const crypto_orig_createHash = crypto.createHash;
// eslint-disable-next-line eqeqeq
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == 'md4' ? 'sha256' : algorithm);

const outputDirectory = 'dist';

module.exports = {
	entry: './src/client/index.jsx',
	output: {
		path: path.join(__dirname, outputDirectory),
		filename: 'bundle.js',
		publicPath: '/',
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
			},
		},
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader'],
		},
		{
			test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
			use: [{
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'fonts/',
				},
			}],
		},
		{
			test: /\.(png|jpg|gif)$/,
			use: [{
				loader: 'file-loader',
				options: {},
			}],
		},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	devServer: {
		port: 3000,
		proxy: {
			'/api': 'http://localhost:8080',
			// Cheap trick for grabbing only /login, not /login*
			'/login': 'http://localhost:8080',
		},
		// Required by the dev server to work with react-router.
		historyApiFallback: true,
		// Used during development to allow port forwarding to host015 from local machine
		// disableHostCheck: true,
	},
	plugins: [
		new CleanWebpackPlugin([outputDirectory]),
		new HtmlWebpackPlugin({
			template: './src/client/public/index.html',
			favicon: './src/client/public/favicon.ico',
		}),
	],
};
