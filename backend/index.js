if (process.env.NODE_ENV === 'development') {
	//? ubicar .env
	require('dotenv').config();
}
const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
//? requerido para usar __dirname en rutas
const path = require('path');
const cors = require('cors');

// Initializations
const app = express();
require('./database');

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
const storage = multer.diskStorage({
	destination: path.join(__dirname, 'public/uploads'),
	filename(req, file, cb) {
		cb(null, new Date().getTime() + path.extname(file.originalname));
	},
});
//? single: solo 1 archivo a la vez, 'image': input del formulario en el frontEnd
app.use(multer({ storage }).single('image'));
//? interpretar datos desde el form en frontEnd
app.use(express.urlencoded({ extended: false }));
//? interpretar peticiones ajax (json)
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/books', require('./routes/books'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(app.get('port'), console.log(`Server on port ${app.get('port')}`));
