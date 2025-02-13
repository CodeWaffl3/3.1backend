const express = require('express')
const morgan = require('morgan');
const app = express()

app.use(express.json());

app.use(express.static('dist'))

/*
    Morgan use
        Morgan es un middleware para Express que registra las solicitudes HTTP que llegan a tu servidor.
        Básicamente, imprime información sobre cada petición en la consola, lo que es útil para depuración y monitoreo

    Printed Info Goes as follows
        httpMethod Route ResponseCode  TimeElapse(in ms) - ResponseSize
    Example would be:
        GET / 200 5.123 ms - 12
*/


const MAX_ID = 10000

let user_data = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
];


const getRandomZeroToMax = (max) => {
    return Math.random() * max
}

app.get('/api/persons/', (request, response) => {
    response.json(user_data);
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const user = user_data.find(person => person.id === id);

    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }
})

app.get('/info/', (request, response) => {

    let number_of_users = user_data.filter(person => person.id ? true : false).map(person => person.id).length;
    //Date Info
    const options = { timeZone: 'America/Mexico_City', timeZoneName: 'short' };
    const now = new Date().toLocaleString('en-US', options);

    // Convert to full date string format
    const dateString = new Date(now).toString();

    response.send(`<p>Phone Book contains ${number_of_users} users.</p>
        <p>${dateString}</p>
    `);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    user_data = user_data.filter(person => person.id !== id);
    //Code 204 no content valid for when eliminating or if there was no user
    response.status(204).end()
})

const createRandomID = () => {
    return getRandomZeroToMax(MAX_ID)
}

morgan.token('bodyShow', (req, res) => JSON.stringify({"name" : req.body.name, "number" : req.body.number}));
app.use(morgan(':bodyShow'));


app.post('/api/persons/', (request, response) => {
    const body = request.body;
    if (!body)
    {
        return response.status(400).json({
            error: "Body is missing"
        })
    }
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    }
    if (user_data.some(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    let randomId = createRandomID()
    while (user_data.some(person => person.id === randomId)) {
        randomId = createRandomID();
    }

    const new_user = {
        id: randomId,
        name: body.name,
        number: body.number
    };
    user_data = user_data.concat(new_user);

    // console.log(user_data)

    response.status(201).json(new_user);
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})