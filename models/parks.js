const mongoose = require('mongoose'); 
const Review = require('./reviews');
const Schema = mongoose.Schema;
const opts = { toJSON: {virtuals: true}};
//By default< Mongoose does not include virtuals when you conver a doc to JSON.

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
    geometry: { //it's the pattern GeoJson works
            type: {
              type: String, 
              enum: ['Point'], // 'location.type' must be 'Point'
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
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
}, opts);

parkSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {$in: doc.reviews}
        })
    }
})

parkSchema.virtual('properties.popUpMarkup').get(function (){
    return `<strong><a href="/parks/${this._id}">${this.name}</a>`
})
const Park = mongoose.model('Park', parkSchema);

module.exports = Park;