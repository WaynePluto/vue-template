const target = 'http://127.0.0.1:3000'

module.exports = {
  '/api': {
    target,
    changeOrigin: true,
  },
}
