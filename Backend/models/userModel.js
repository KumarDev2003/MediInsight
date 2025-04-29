const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MediInsight');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'reportModel', // Reference to the reportModel
        },
    ],
    doctors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'drModel',
        }
      ],      
});

module.exports = mongoose.model('userModel', userSchema);