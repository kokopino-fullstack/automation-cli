const ModbusRTU = require("modbus-serial");

const NIBE_DEFAULT_CLIENT_ID = 30;
const NIBE_VENTILATION_SPEED_REG = 14;

const op = process.argv[2];
const speed = process.argv[3];
const speedSlow = 0;
const speedMedium = 1;
const speedHigh = 2;
let setSpeed = speedSlow;

if(op === "read" || op === "write") {
	console.log(`Performing ${op} operation to ventilation speed`);
	switch(speed) {
		case "slow":
			setSpeed = speedSlow;
			break;
		case "medium":
			setSpeed = speedMedium;
			break;
		case "high":
			setSpeed = speedHigh;
			break;
		default:
			console.log("Invalid speed value. Select one of: slow, medium, high");
	}
} else {
	console.log(`Unknown operation ${op}`);
	process.exit(1);
}

const round = (value, precision) => {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
const readVentilationSpeed = async (client) => {
	try {
		const result = await client.readHoldingRegisters(NIBE_VENTILATION_SPEED_REG, 1);
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
	if (op === "write") {
		await client.writeRegister(NIBE_VENTILATION_SPEED_REG, setSpeed);
		const newSpeed = await readVentilationSpeed(client);
		console.log("New ventilation speed is ", newSpeed);
	}
})();


