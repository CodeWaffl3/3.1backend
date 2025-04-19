require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
const Person = require('./models/person.js');



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

app.get('/api/persons/', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id)
        .then((person) => {
            person ? response.json(person) : response.status(404).end();
        })
        .catch((error) => {
            next(error);
        });
})

app.get('/info/', (request, response, next) => {
    Person.find({})
        .then((persons) => {
            console.log(persons);
            //Date Info
            const options = { timeZone: 'America/Mexico_City', timeZoneName: 'short' };
            const now = new Date().toLocaleString('en-US', options);

            // Convert to full date string format
            const dateString = new Date(now).toString();

            const number_of_users = persons.map(person => person.id).length;
            response.send(`<p>Phone Book contains ${number_of_users} users.</p>
                <p>${dateString}</p>`
            );
        })
        .catch((error) => next(error));
});


app.post('/api/persons/', (request, response, next) => {
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
    //TODO: Make it work with MongoDB
    // if (user_data.some(person => person.name.toLowerCase() === body.name.toLowerCase())) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     });
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save()
        .then((savedPerson) => {
        response.json(savedPerson);
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response,next) => {
    const { name, number } = request.body;

    const newPhone = {
        name: name,
        number: number,
    }

    Person.findByIdAndUpdate(request.params.id, newPhone, { new: true, runValidators: true, context: 'query' })
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndDelete(request.params.id)
        .then((person) => {
            //Code 204 no content valid for when eliminating or if there was no user
            person ? response.json(person) : response.status(204).end();
        })
        .catch(error => next(error));
})

morgan.token('bodyShow', (req) => JSON.stringify({ "name" : req.body.name, "number" : req.body.number }));
app.use(morgan(':bodyShow'));



const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error);
}

//TODO NOTA: este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})