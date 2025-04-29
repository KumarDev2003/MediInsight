const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MediInsight');

const drSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    patients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel' 
        },
    ],
});

module.exports = mongoose.model('drModel', drSchema);