'use strict'

module.exports = (RED) => {
    class UniPiOutput {
        constructor(config) {
            RED.nodes.createNode(this, config)

            this.config = config
            this.node = RED.nodes.getNode(config.unipi)
            this.unipi = this.node.unipi

            this.on('input', (msg) => {
                console.log(config.output,config.circuit,msg.payload)
                this.unipi[config.output](config.circuit, msg.payload)
            })

            this.unipi
                .on('connected', () => {
                    this.updateStatus(this.unipi.device(config.dev, config.circuit))
                })
                .on('relay', this.updateStatus.bind(this))
                .on('led', (device, previous) => {
                    // TODO: LEDs do not emit socket events
                    if (config.output === 'led' && config.circuit === device.circuit) {
                        console.log('led', device) // TODO
                        this.updateStatus(device)
                    }
                })
                .on('digitalOutput', (device, previous) => {
                    if (config.circuit === device.circuit) {
                        this.updateStatus(device)
                    }
                })
        }

        updateStatus(device) {
            if (this.config.circuit !== device.circuit) {
                return
            }

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

        res.json(node.unipi[req.query.output + 's']())
    })
}
