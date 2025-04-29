const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MediInsight');

const reportSchema = new mongoose.Schema({
    text: {
        type: String
    },
    photo: {
        type: Buffer  // Storing the actual image data as a Buffer
    },
    dateTime: {
        type: Date,
        default: Date.now  // Automatically record the date and time when the report is created
    }
});

module.exports = mongoose.model('reportModel', reportSchema);
