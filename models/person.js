const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI;

console.log(`Conecting to ${url}`);

mongoose.connect(url)
    .then(() => {
    console.log('Connected to MongoDB');
    }).catch(error => {
    console.log('error connecting to MongoDB:', error.message)
    });

const phoneBookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 9,
        validate: {
            validator: function (value) {
                return /\d{2,3}-\d/.test(value)
            },
            message: 'Phone number is not valid - format should be the style 33-123098'
        },
        required: [true, 'Phone number is required']
    },
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('person', phoneBookSchema);

