const mongoose = require('mongoose'); 
const Review = require('./reviews');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
        url: String,
        filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

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
    image: [ImageSchema], // update image to be an array to store multiple image

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