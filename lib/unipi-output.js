'use strict'

module.exports = (RED) => {
    class UniPiOutput {
        constructor(config) {
            RED.nodes.createNode(this, config)

            this.node = RED.nodes.getNode(config.unipi)
            this.unipi = this.node.unipi
            this.config = config
console.log(config)
            this.on('input', (msg) => {
                console.log(this.config.output,config.circuit,msg.payload)
                this.unipi[this.config.output](config.circuit, msg.payload)
            })

            this.unipi
                .on('connected', () => {
                    this.updateStatus(this.unipi.device(this.config.dev, this.config.circuit))
                })
                .on('relay', (msg, previous) => {
                    if (config.output === 'relay' && msg.circuit === config.circuit) {
                        this.updateStatus(msg)
                    }
                })
        }

        updateStatus(device) {
            this.status({
                fill: 'green',
                shape: device.value ? 'dot' : 'ring',
                text: 'connected - ' + (device.value ? 'on' : 'off')
            })
        }
    }

    RED.nodes.registerType('unipi-output', UniPiOutput)

    RED.httpAdmin.get('/unipi/outputs', (req, res) => {
        let node = RED.nodes.getNode(req.query.unipi)

        if (!node) {
            return res.status(400).send('UniPi not found.')
        }

        res.json(node.unipi[req.query.filter + 's']())
    })
}
