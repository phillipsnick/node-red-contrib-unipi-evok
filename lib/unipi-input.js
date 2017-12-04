'use strict'

module.exports = (RED) => {
    class UniPiInput {
        constructor(config) {
            RED.nodes.createNode(this, config)

            // this is a UniPiNode
            this.node = RED.nodes.getNode(config.unipi)
            this.name = config.name

            //this.on('input', (msg) => {
            //    this.node.unipi.send(msg.payload)
        //})

          //this.node.unipi.on('message', (message) => {
          //this.send({
      //payload: message
      //})
    //})
        }
    }

    RED.nodes.registerType('unipi-input', UniPiInput)
}
