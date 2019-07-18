const mongoose = require('mongoose');
mongoose.connect("mongodb://172.24.0.2:27017/ProyectoCatCeller");
module.exports = mongoose;
