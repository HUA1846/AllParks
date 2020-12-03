const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const parkSchema = new Schema({
    name: {
        type: String,
        
        maxlength: 40,
    },
    parking: {
        type: String,
        
    },
    price: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        
    },
    description: {
        type: String
        
    },
    location: {
        type: String,
        
    },
    image: String      
});

const Park = mongoose.model('Park', parkSchema);

module.exports = Park;