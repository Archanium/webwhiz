const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    console.log("Proxy configuration file loaded");
    app.use(
        '/api/',
        createProxyMiddleware({
            target: 'http://web:3000/',
            changeOrigin: true,
            pathRewrite: {
                '^/api/': '/', // remove base path
            },
        })
    );
};