const mongoose = require('mongoose');
const Park = require('./models/parks');
mongoose.connect('mongodb://localhost:27017/socalparks', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

    const seedParks = [
        {
            name: 'Cuyamaca State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'San Diego, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Mount San Jacinto State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Riverside County, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Malibu Creek State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Malibu, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'El Capitan Beach State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Santa Barbara, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Bolsa Chica Beach State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Orange County, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Gaviota State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Santa Barbara, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Chino Hills State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Chino Hills, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Border Field State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'San Diego, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Saddleback Butte State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Antelope Valley, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Palomar Mountain State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'densely wooded',
            location: 'CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Crystal Cove State Park',
            parking: 'paid',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Orange County, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Barnes Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Monterey Park, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Placerita Canyon State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'San Gabriel Mountains, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Will Rogers State Park',
            parking: 'free onsite',
            category: 'state',
            price: 0,
            description: 'good for family',
            location: 'Pacific Palisades, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
        {
            name: 'Rosemead Park',
            parking: 'free onsite',
            category: 'local',
            price: 0,
            description: 'good for family',
            location: 'Rosemead, CA',
            image: "https://source.unsplash.com/collection/657335"
        },
    ]
    
    Park.insertMany(seedParks)
        .then(res => {
            console.log(res)
        })
        .catch(e => {
            console.log(e)
        })