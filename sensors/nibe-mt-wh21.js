const ModbusRTU = require("modbus-serial");

const NIBE_DEFAULT_CLIENT_ID = 30;

const round = (value, precision) => {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
const readVentilationSpeed = async (client) => {
	try {
		const result = client.readHoldingRegisters(0, 2);
		if (result && result.data && result.data.length === 1) {
			return result.data[0];
		} else {
			console.log("Error reading ventilation speed, result was ", result);
		}
	} catch (err) {
		console.log('Error reading registers! ', err);
	}
}

(async () => {
	const client = new ModbusRTU();
	await client.connectRTUBuffered("/dev/ttyUSB0", {
		baudRate: 19200,
		parity: "even",
	});
	client.setID(NIBE_DEFAULT_CLIENT_ID);
	const currentSpeed = await readVentilationSpeed(client);
	console.log("Current ventilation speed is ", currentSpeed);
})();


