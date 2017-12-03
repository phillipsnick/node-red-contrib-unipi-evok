'use strict'

module.exports = (RED) => {
    class UniPiApi {
        constructor(config) {
            RED.nodes.createNode(this, config)

            // this is a UniPiNode
            this.node = RED.nodes.getNode(config.unipi)
            this.name = config.name

            this.on('input', msg => {
                //TODO: do something with the input
            })

            console.log(this.node.unipi)
            this.node.unipi.on('message', (message) => {
                console.log(message)
                this.send(message)
            })
        }
    }

    RED.nodes.registerType('unipi-api', UniPiApi)
}
