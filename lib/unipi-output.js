'use strict'

module.exports = (RED) => {
    class UniPiInput {
        constructor(config) {
            RED.nodes.createNode(this, config)

            this.node = RED.nodes.getNode(config.unipi)
            this.config = config

            this.on('input', (msg) => {
                this.node.unipi.relay(config.circuit, msg.payload)
            })

            this.node.unipi
                .on('connected', () => {
                    this.updateStatus()
                })
                .on('relay', (msg, previous) => {
                    if (msg.circuit === config.circuit) {
                        this.updateStatus()
                    }
                })
        }

        updateStatus() {
            let flag = this.node.unipi.relay(this.config.circuit)

            this.status({
                fill: 'green',
                shape: flag? 'dot' : 'ring',
                text: 'connected - ' + (flag ? 'on' : 'off')
            })
        }
    }

    RED.nodes.registerType('unipi-output', UniPiInput)

    RED.httpAdmin.get('/unipi/outputs', (req, res) => {
        let node = RED.nodes.getNode(req.query.unipi)

        if (!node) {
            return res.status(400).send('UniPi not found.')
        }

        res.json(node.unipi[req.query.filter + 's']())
    })
}
