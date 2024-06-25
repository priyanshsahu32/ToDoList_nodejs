const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    token:{
        type:String,
        require:true
    }

});


module.exports  = mongoose.model('token',TokenSchema);