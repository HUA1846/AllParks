const mongoose = require('mongoose'); 
const Review = require('./reviews');
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
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [ 
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
        } 
    ]     
});

parkSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {$in: doc.reviews}
        })
    }
})

const Park = mongoose.model('Park', parkSchema);

module.exports = Park;