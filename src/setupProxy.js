const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: {
        "^/api": "/api"
      },
      // Hỗ trợ UTF-8 encoding
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Content-Type'] = 'application/json; charset=utf-8';
      },
      // Đảm bảo request header có charset
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
    })
  );
};