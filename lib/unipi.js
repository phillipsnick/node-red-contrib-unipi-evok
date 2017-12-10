"use strict"

const unipi = require('unipi-evok')

module.exports = (RED) => {
    class UniPiNode {
        constructor(config) {
            RED.nodes.createNode(this, config)

            if (!config.host || !config.restPort || !config.wsPort) {
                return
            }

            this.connecting()

            this.unipi = new unipi({
                host: config.host,
                restPort: config.restPort,
                wsPort: config.wsPort
            })
            this.unipi
                .on('connected', this.connected.bind(this))
                .on('error', this.error.bind(this))
                .connect()
        }

        connecting() {
            this.status({
                fill: 'grey',
                shape: 'dot',
                text: 'connecting...'
            })
        }

        error() {
            this.status({
                fill: 'red',
                shape: 'dot',
                text: 'error'
            })
        }

        connected() {
            this.status({
                fill: 'green',
                shape: 'dot',
                text: 'connected'
            })
        }
    }

    RED.nodes.registerType('unipi', UniPiNode)
}
