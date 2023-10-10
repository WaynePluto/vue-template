const { networkInterfaces } = require('os')

module.exports = function getIPAdress() {
  const interfaces = networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address
      }
    }
  }
}
