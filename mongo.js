const mongoose = require('mongoose')
require('dotenv').config();


if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const name = process.argv[2]
const number = process.argv[3]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('person', phoneBookSchema)

if (name && number) {
    const phone = new Person({
        name: name,
        number: number
    })

    phone.save().then(result => {
        console.log('phone saved!', result)
        mongoose.connection.close()
    })
}
else{
    Person.find({}).then((result) => {
        result.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close();
    });
}
