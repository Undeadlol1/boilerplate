const faker = require('faker')
const uniqid = require('uniqid')
const { User } = require('../models/index.js')

// const users = []

// for(x=0; x<10; x++) {
//     users.push({
//         username: uniqid(),
//         image   : faker.image.imageUrl(),
//         password: faker.internet.email(),
//     })
// }

const users = [
    {
        username: 'sabinochka',
        password: "kakashechka",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'sabzero',
        password: "pisulechka",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'pupsik',
        password: "volosatiy",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'pechenusha',
        password: "sladenykaya",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'karamelka',
        password: "sladenykaya",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'dominikana',
        password: "sladenykaya",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'slezki',
        password: "sladenykaya",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'penisy',
        password: "sladenykaya",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'kavabanga',
        password: "sladenykaya",
        image   : faker.image.imageUrl(),        
    },
    {
        username: 'kadzima',
        password: "sladenykaya",
        image   : faker.image.imageUrl(),        
    },
]

module.exports = users