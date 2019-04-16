const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

const app = express()

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());


// Working
app.get('/api/persons/', (request, response, next) => {
  Person
    .find({})
    .then(data => {
      response.json(data.map(listing => listing.toJSON()));
    })
    .catch(error => next(error));
})

// Working
app.get('/info', (request, response, next) => {
  Person.find({})
    .then(person => {
      const count = person.length;
      const info = `Puhelinluettelossa on ${count} henkilön tiedot`;
      const date = new Date();
      date.toUTCString;
      response.send(`<p>${info}</p><p>${date}</p>`);
    })
    .catch(error => next(error));
})

// Working
app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person.toJSON());
    })
    .catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(result => {
      response.json(result.toJSON());
    })
    .catch(error => next(error));
})

// Working
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findOneAndDelete(request.params.id)
    .then(result => {
      response.json(204).end();
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const person = request.body;

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON());
    })
    .catch(error => {
      next(error)
    });
})

app.use((error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
