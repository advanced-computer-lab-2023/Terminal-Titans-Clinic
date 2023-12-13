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
import Message from './Models/messageModel.js'
import protect from './middleware/authMiddleware.js'
import appointmentModel from './Models/appointmentModel.js'
import notificationModel from './Models/notificationModel.js'
import notificationModule from './Routes/notificationRoute.js'
import { notificationChangeStream } from './Models/notificationModel.js'
import mongoose from 'mongoose'


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
app.use('/notification', notificationModule)

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
let userSocketMap = new Map();
io.on("connection", async (socket) => {
	try {
		console.log('hele', socket?.handshake?.auth?.Authorization);
		if (socket?.handshake?.auth?.Authorization) {
			const token = socket.handshake.auth.Authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// socket.id = decoded.id;
			userSocketMap.set(decoded.id, socket.id);
			console.log('socket.id', socket.id,);
			socket.join(decoded.id);
			socket.emit("me", socket.id)
		}

		// socket.emit("me", socket.id)

		socket.on("disconnect", () => {
			socket.broadcast.emit("callEnded")
		})

		socket.on("callUser", (data) => {
			console.log('callUser', userSocketMap);
			// loop through all the sockets and find the one with the id
			userSocketMap.forEach((value, key) => {
				console.log('value', value);
				console.log('key', key);
				console.log('data.from', data.from);
				console.log('data.name', data.name);
				if (key == data.userToCall) {
					// to room id w from socket id
					io.to(key).emit("callUser", { signal: data.signalData, from: data.from, name: data.name, video: data.video })
				}
			})
		})

		socket.on('rejectCall', ({ from }) => {
			console.log('rejectCall', from);
			userSocketMap.forEach((value, key) => {
				console.log('value', value);
				console.log('key', key);
				console.log('from', from);
				if (value == from) {
					console.log('rejectCall2', from);
					io.to(key).emit("callRejected")
				}
			})
			// io.to(from).emit("callRejected");
		});

		socket.on("answerCall", (data) => {
			console.log('answerCall1', data);
			userSocketMap.forEach((value, key) => {
				if (value == data.to) {
					console.log('answerCall2', data.to, data.signal);
					io.to(key).emit("callAccepted", data.signal)
				}
			})
		})

		socket.on("endCall", ({ to }) => {
			console.log('endCall', to);
			userSocketMap.forEach((value, key) => {
				console.log('value', value);
				console.log('key', key);
				console.log('to', to);
				if (value == to) {
					console.log('endCall2', to);
					io.to(key).emit("callEnded")
				}
			})
		});
	} catch (error) {
	}
})

//chat
const wss = new WebSocketServer({ server });
wss.on('connection', async (connection, req) => {
	function notifyAboutOnlinePeople() {
		console.log('notify');
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
			notifyAboutOnlinePeople();
			console.log('connected', connection.userId, connection.username);
		}
		// else if (file) {
		// 	console.log('size', file.data.length);
		// 	const parts = file.name.split('.');
		// 	const ext = parts[parts.length - 1];
		// 	filename = Date.now() + '.' + ext;
		// 	const path = __dirname + '/uploads/' + filename;
		// 	const bufferData = new Buffer(file.data.split(',')[1], 'base64');
		// 	fs.writeFile(path, bufferData, () => {
		// 		console.log('file saved:' + path);
		// 	});
		// }
		if (recipient && (text || file)) {
			console.log('message', messageData);
			const messageDoc = await Message.create({
				sender: connection.userId,
				recipient,
				text,
				file: file ? filename : null,
			});
			const notification = await notificationModel.create({
				userId: recipient,
				Message: 'You have a new message from ' + connection.username,
				Status: 'unread',
				type: 'Chat',
			});

			notificationChangeStream.on('change', (change) => {
				console.log('in change', change);
				console.log();
				[...wss.clients]
					.filter(c => c.userId == recipient.toString())
					.forEach(c => c.send(JSON.stringify({
						myNotification: notification,
						type: 'notification'
					})));
				// io.emit('notification', 'New notification!');
			});

			[...wss.clients]
				.filter(c => c.userId == recipient.toString())
				.forEach(c => c.send(JSON.stringify({
					text,
					sender: connection.userId,
					recipient,
					// file: file ? filename : null,
					_id: messageDoc._id,
				})));
		}
		else {
			if (recipient) {
				notificationChangeStream.on('change', (change) => {
					console.log('in change2', change);
					console.log();
					[...wss.clients]
						.filter(c => c.userId == recipient.toString())
						.forEach(c => c.send(JSON.stringify({
							myNotification: notification,
							type: 'notification'
						})));
					// io.emit('notification', 'New notification!');
				});
			}
		}
	});

	// notify everyone about online people (when someone connects)
	notifyAboutOnlinePeople();
});

app.get('/messages/:userId', protect, async (req, res) => {
	const myUser = await userModel.findById(req.user._id).select('-password');
	if (!myUser) return res.status(404).json({ message: 'User not found' });

	const { userId } = req.params;
	const messages = await Message.find({
		$or: [
			{ sender: req.user._id, recipient: userId },
			{ sender: userId, recipient: req.user._id },
		],
	}).sort({ createdAt: -1 });
	res.status(200).json(messages);
});

app.get('/people', protect, async (req, res) => {
	// console.log(req.user.Username,'people');
	const myUser = req.user;
	if (!myUser) return res.status(404).json({ message: 'User not found' });
	if (myUser.__t == 'patient') {
		let appointments = await appointmentModel.find({ PatientId: req.user._id });
		let people = [];
		for (let i = 0; i < appointments.length; i++) {
			let doctor = await userModel.findById(appointments[i].DoctorId).select('-ID -License -Degree -HealthHistory -password');
			people.push(doctor);
		}
		let pharmacists = await userModel.find({ __t: 'Pharmacist' }).select('-ID -License -Degree -HealthHistory -password');
		for (let i = 0; i < pharmacists.length; i++) {
			people.push(pharmacists[i]);
		}
		let mySet = new Set(people);
		people = [...mySet];
		res.status(200).json({ myUser: myUser, Result: people });
	}
	else if (myUser.__t == 'Doctor') {
		let appointments = await appointmentModel.find({ DoctorId: req.user._id });
		let people = [];
		for (let i = 0; i < appointments.length; i++) {
			let patient = await userModel.findById(appointments[i].PatientId).select('-ID -License -Degree -HealthHistory -password');
			people.push(patient);
		}
		let pharmacists = await userModel.find({ __t: 'Pharmacist' }).select('-ID -License -Degree -HealthHistory -password');
		for (let i = 0; i < pharmacists.length; i++) {
			people.push(pharmacists[i]);
		}
		let mySet = new Set(people);
		people = [...mySet];

		res.status(200).json({ myUser: myUser, Result: people });
	}
	else if (myUser.__t == 'Pharmacist') {
		let people = await userModel.find({ __t: { $in: ['patient', 'Doctor'] } }).select('-ID -License -Degree -HealthHistory -password');

		res.status(200).json({ myUser: myUser, Result: people });
	}
});