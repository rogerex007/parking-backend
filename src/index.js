const express = require('express');
const app = express();

const vehiclesRoutes = require('./routes/vehicles.routes');
const registersRoutes = require('./routes/registers.routes');

//Setting
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json());


//Route
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/registers', registersRoutes);

//Starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port: ${app.get('port')}`);
})