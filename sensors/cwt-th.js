const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

// open connection to a serial port
client.connectRTUBuffered("/dev/ttyUSB0", { baudRate: 4800 });
client.setID(1);


function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}


setInterval(function() {
    client.readHoldingRegisters(0,2, function(err, data) {
	if(err) {
	    console.log('Error reading registers! ', err);
	}
	if(data && data.data && data.data.length === 2) {
	    const humidity = round(data.data[0] / 10);
	    const temperature = round(data.data[1] / 10);
	    console.log(`Temperature at ${Date.now().toString()}: ${temperature}°C Humidity: ${humidity}%rh`);
	} else {
	    console.log('Error in returned data!');
	}
	
    });
}, 1000);
