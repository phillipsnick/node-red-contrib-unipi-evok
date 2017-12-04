"use strict"

const unipi = require('unipi-evok')

module.exports = (RED) => {
    class UniPiNode {
        constructor(config) {
            RED.nodes.createNode(this, config)

            if (!config.host || !config.restPort || !config.wsPort) {
                return
            }

            this.unipi = new unipi({
                host: config.host,
                restPort: config.restPort,
                wsPort: config.wsPort
            })
            this.unipi.connect()
        }
    }

    RED.nodes.registerType('unipi', UniPiNode)
}
