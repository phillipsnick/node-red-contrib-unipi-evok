"use strict"

const unipi = require('unipi-evok')

module.exports = (RED) => {
    class UniPiNode {
        constructor(config) {
            RED.nodes.createNode(this, config)

            //TODO: do we really need to store these like this?
            this.name = config.name
            this.host = config.host
            this.restPort = config.restPort
            this.wsPort = config.wsPort
            this.node = this

            if (this.host && this.restPort && this.wsPort) {
                this.unipi = new unipi({
                    host: this.host,
                    restPort: this.restPort,
                    wsPort: this.wsPort
                })
            }
        }
    }

    RED.nodes.registerType('unipi', UniPiNode)
}
