'use strict'

module.exports = (RED) => {
    class UniPiInput {
        constructor(config) {
            RED.nodes.createNode(this, config)

            this.connecting();
            this.config = config
            this.node = RED.nodes.getNode(config.unipi)
            this.unipi = this.node.unipi

            this.unipi
                .on('connected', () => {
                    this.display(this.unipi[config.input](config.circuit))
                })
                .on('error', this.error.bind(this))
                .on('input', this.input.bind(this))
        }

        input(device) {
            this.updateStatus(device)

            if (!this.config.button) {
                //TODO: maybe only send if its diff?
                this.send({payload: device.value === 1})
                return
            }

            if (device.value === 1) {
                this.press()
            } else {
                this.release()
            }
        }

        press() {
            this.timeout = setTimeout(() => {
                // mark it as sent so we don't emit on press only
                this.sent = true

                // send on output 2 (press and hold)
                this.send([null, {payload: true}]);
            }, parseInt(this.config.hold))
        }

        release() {
            if (this.timeout) {
                clearTimeout(this.timeout)
            }

            if (!this.sent) {
                // we haven't sent yet, it's within hold time so it's a click
                this.send([{payload: true}])
            } else {
                // passed hold time
                this.send([null, {payload: false}])
            }

            this.sent = false
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

    RED.nodes.registerType('unipi-input', UniPiInput)

    RED.httpAdmin.get('/unipi/inputs', (req, res) => {
        let node = RED.nodes.getNode(req.query.unipi)

        if (!node) {
            return res.status(400).send('UniPi not found.')
        }

        res.json(node.unipi[req.query.input + 's']())
    })
}
