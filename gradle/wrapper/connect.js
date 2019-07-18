const mongoose = require('mongoose');
mongoose.connect("mongodb://172.20.0.1:27017/ProyectoCatCeller");
module.exports = mongoose;
