var radar = require('flightradar24-client/lib/radar');

module.exports = function (RED) {
    function Flightradar24Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            var lat, lon;
            if (config.latType === 'num') {
                lat = Number(config.lat);
            } else {
                lat = Number(RED.util.getMessageProperty(msg, config.lat));
            }
            if (config.lonType === 'num') {
                lon = Number(config.lon);
            } else {
                lon = Number(RED.util.getMessageProperty(msg, config.lon));
            }

            var radius = 100000;
            radar(lat + 1, lon - 1, lat - 1, lon + 1).then(function (data) {
                data.forEach(function (flight) {
                    msg.payload = flight;
                    msg.payload.lat = flight.latitude;
                    msg.payload.latitude = undefined;
                    msg.payload.lon = flight.longitude;
                    msg.payload.longitude = undefined;
                    msg.payload.name = flight.flight || flight.registration || flight.modeSCode;
                    msg.payload.icon = "plane";
                    msg.payload.iconColor = "red";
                    node.send(msg);
                });
            }).catch(function (error) {
                node.error(error, msg);
            });
        });
    }
    RED.nodes.registerType("flightradar24", Flightradar24Node);
};
