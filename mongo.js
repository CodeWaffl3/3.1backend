const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://haffl3fso:${password}@full-stack-open.iuo0o.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=full-stack-open`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('person', phoneBookSchema)

if (name && number) {
    const phone = new person({
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
