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
        email   : "sabinochka@gmail.com",
    },
    {
        username: 'sabzero',
        password: "pisulechka",
        email   : "sabzero@gmail.com",
    },
    {
        username: 'pupsik',
        password: "volosatiy",
        email   : "pupsik@gmail.com",
    },
    {
        username: 'pechenusha',
        password: "sladenykaya",
        email   : "pechenusha@gmail.com",
    },
    {
        username: 'karamelka',
        password: "sladenykaya",
        email   : "karamelka@gmail.com",
    },
    {
        username: 'dominikana',
        password: "sladenykaya",
        email   : "dominikana@gmail.com",
    },
    {
        username: 'slezki',
        password: "sladenykaya",
        email   : "slezki@gmail.com",
    },
    {
        username: 'penisy',
        password: "sladenykaya",
        email   : "penisy@gmail.com",
    },
    {
        username: 'kavabanga',
        password: "sladenykaya",
        email   : "kavabanga@gmail.com",
    },
    {
        username: 'kadzima',
        password: "sladenykaya",
        email   : "kadzima@gmail.com",
    },
]

module.exports = users