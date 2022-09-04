const express = require('express')
const path = require('path');
const mongoose = require('mongoose')
const app = express();
const http = require('http').createServer(app);
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')
dotenv.config();

// Middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(cors())


// Routes
const AppRouter = require('./routes/app/')
const AdminRouter = require('./routes/admin');

// Custom Middlewares
const isUserAdmin = require('./middlewares/is-admin.middleware');
const addUserDetailsToRequest = require('./middlewares/add_user');


app.use('/app', addUserDetailsToRequest, AppRouter)
app.use('/admin', isUserAdmin, AdminRouter)

// Common Error Middleware
app.use((error, req, res, next) => {
	console.log('Failed Paths: ', req.path)
	const message = error.message || error
	const status = error.status || 500
	return res.status(status).json({
		message
	})
})

const server = async () => {
	try {
		const PORT = process.env.PORT || 3001;
		const MONGO_CONNECTION = process.env.MONGO_CONNECTION || 'mongodb+srv://mahesh:mahesh@cluster0.vtckz.mongodb.net/tbss?authSource=admin&replicaSet=atlas-5dc8jp-shard-0&readPreference=primary'
		await mongoose.connect(MONGO_CONNECTION, {
			useNewUrlParser: true,
		});
		console.log('DB connected')
		http.listen(PORT, () => {
			console.log('Server started on ', PORT);
		});
	} catch (error) {
		console.log('Error', error);
	}
};

server();