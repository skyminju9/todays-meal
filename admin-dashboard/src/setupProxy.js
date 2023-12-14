const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://ceprj.gachon.ac.kr:80', // Express 서버가 실행 중인 포트
      changeOrigin: true,
    })
  );
};
