'use strict'

module.exports = (RED) => {
    class UniPiOutput {
        constructor(config) {
            RED.nodes.createNode(this, config)

            this.connecting();
            this.config = config
            this.node = RED.nodes.getNode(config.unipi)
            this.unipi = this.node.unipi

            this.on('input', (msg) => {
                this.unipi[config.output](config.circuit, msg.payload)
            })

            this.unipi
                .on('connected', () => {
                    this.display(this.unipi[config.output](config.circuit))
                })
                .on('error', this.error.bind(this))
                .on(config.output, this.updateStatus.bind(this))
        }

        updateStatus(device) {
            if (this.config.circuit !== device.circuit) {
                return
            }

            this.display(device.value)
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

        display(value) {
            this.status({
                fill: 'green',
                shape: value ? 'dot' : 'ring',
                text: 'connected - ' + (value ? 'on' : 'off')
            })
        }
    }

    RED.nodes.registerType('unipi-output', UniPiOutput)

    RED.httpAdmin.get('/unipi/outputs', (req, res) => {
        let node = RED.nodes.getNode(req.query.unipi)

        if (!node) {
            return res.status(400).send('UniPi not found.')
        }

        res.json(node.unipi[req.query.output + 's']())
    })
}
