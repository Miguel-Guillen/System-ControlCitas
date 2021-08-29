const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const upload = require('./routes/file-upload');
const path = require('path');

app.use(express.static(path.join(__dirname, './public')));

require('dotenv').config();

// Settings
app.set('port', process.env.PORT || 3000);
// Middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes

// Public routes
app.use('/api' ,require('./routes/publicRoutes/branchOffices'));
app.use('/api' ,require('./routes/publicRoutes/services'));
app.use('/api' ,require('./routes/publicRoutes/employees'));
app.use('/api' ,require('./routes/publicRoutes/news'));
app.use('/api' ,require('./routes/publicRoutes/auth'));
app.use('/api' ,require('./routes/publicRoutes/users'));
app.use('/api' ,require('./routes/publicRoutes/sucursales'));
app.use('/api' ,require('./routes/publicRoutes/employee_service'));
app.use('/api' ,require('./routes/publicRoutes/dates'));
app.use('/api' ,require('./routes/publicRoutes/schedules'));
app.use('/api' ,require('./routes/publicRoutes/dates'));
app.use('/api' ,require('./routes/publicRoutes/webhook'));
app.use('/api' ,require('./routes/publicRoutes/correo'));
app.use('/api' ,require('./routes/publicRoutes/options'));

// Private Routes with token
app.use('/api' ,require('./routes/privateRoutes/branchOffices'));
app.use('/api' ,require('./routes/privateRoutes/services'));
app.use('/api' ,require('./routes/privateRoutes/employees'));
app.use('/api' ,require('./routes/privateRoutes/news'));
app.use('/api' ,require('./routes/privateRoutes/auth'));
app.use('/api' ,require('./routes/privateRoutes/sucursales'));
app.use('/api' ,require('./routes/privateRoutes/employee_service'));
app.use('/api' ,require('./routes/privateRoutes/dates'));
app.use('/api' ,require('./routes/privateRoutes/schedules'));
app.use('/api' ,require('./routes/privateRoutes/users'));
app.use('/api' ,require('./routes/privateRoutes/options'));

app.post('/api/upload', upload.array('image', 1), (req, res) => {
    res.send({ image: req.file });
});
  
// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});