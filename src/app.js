import connectDB from './config/db.js'
import dotenvModule from 'dotenv'
import express from 'express'
import securityModule from './Routes/securityRoute.js'
import DoctorModule from './Routes/doctorRoute.js'
import PatientModule from './Routes/patientRoute.js'
import AdminModule from './Routes/adminRoute.js'
import PharmacistModule from './Routes/pharmacistRoute.js'
import ejs from 'ejs'
import cors from 'cors';
import http from 'http'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws'
import userModel from './Models/userModel.js'


const dotenv = dotenvModule.config();

connectDB()

//App variables
const app = express();
const port = process.env.PORT || "8000";

const server = http.Server(app)

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:3000",
	})
)
app.use('/security', securityModule)
app.use('/doctor', DoctorModule)
app.use('/patient', PatientModule)
app.use('/admin', AdminModule)
app.use('/Pharma', PharmacistModule)

app.set('view engine', 'ejs');

//app.render('home.ejs')
app.get('/', (req, res) => {
	res.render('../../views/home');
})
app.post('/', (req, res) => {
	var username = req.body.user;
	if (!username) return (res.status(400));
	if (username == "patient") res.render('../../views/patientPage');
	if (username == "doctor") res.render('../../views/doctorPage');
	if (username == "admin") res.render('../../views/adminPage');
})
server.listen(port, "localhost", () => {
	console.log("Server is running on port 8000");
})

// for video calling
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});
io.attach(server);

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})

	socket.on("endCall", ({ to }) => {
		io.to(to).emit("callEnded");
	});
})

//chat
console.log(server);
const wss = new WebSocketServer({ server });
wss.on('connection', async (connection, req) => {
	function notifyAboutOnlinePeople() {
		[...wss.clients].forEach(client => {
			client.send(JSON.stringify({
				online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username })),
			}));
		});
	}

	connection.isAlive = true;

	connection.timer = setInterval(() => {
		connection.ping();
		connection.deathTimer = setTimeout(() => {
			connection.isAlive = false;
			clearInterval(connection.timer);
			connection.terminate();
			notifyAboutOnlinePeople();
			console.log('dead');
		}, 1000);
	}, 5000);

	connection.on('pong', () => {
		clearTimeout(connection.deathTimer);
	});

	connection.on('message', async (message) => {
		const messageData = JSON.parse(message.toString());
		const { recipient, text, file } = messageData;
		let filename = null;

		if (messageData.token) {
			const decoded = jwt.verify(messageData.token, process.env.JWT_SECRET);
			const myUser = await userModel.findById(decoded.id).select('-password');
			connection.userId = myUser._id;
			connection.username = myUser.Username;
			console.log('connected', connection.userId, connection.username);
		}
		else if (file) {
			console.log('size', file.data.length);
			const parts = file.name.split('.');
			const ext = parts[parts.length - 1];
			filename = Date.now() + '.' + ext;
			const path = __dirname + '/uploads/' + filename;
			const bufferData = new Buffer(file.data.split(',')[1], 'base64');
			fs.writeFile(path, bufferData, () => {
				console.log('file saved:' + path);
			});
		}
		if (recipient && (text || file)) {
			const messageDoc = await Message.create({
				sender: connection.userId,
				recipient,
				text,
				file: file ? filename : null,
			});
			console.log('created message');
			[...wss.clients]
				.filter(c => c.userId === recipient)
				.forEach(c => c.send(JSON.stringify({
					text,
					sender: connection.userId,
					recipient,
					file: file ? filename : null,
					_id: messageDoc._id,
				})));
		}
	});

	// notify everyone about online people (when someone connects)
	notifyAboutOnlinePeople();
});