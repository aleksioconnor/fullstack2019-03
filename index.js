const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(bodyParser.json());
app.use(morgan('tiny'))
app.use(cors())


let details = [{
  id: 1,
  name: "Arto Hellas",
  number: "041-21423123"
}, {
  id: 2,
  name: "Leena Moilanen",
  number: "041-21135135"
}, {
  id: 3,
  name: "Sami Tienari",
  number: "031-95931581"
}]

// This is a route. Requests routed to the root will receive the respons defined by .send
// parameter request contains the information of the HTTP request
// param res is used to define the response
app.get('/api/persons/', (request, response) => {
  response.json(details)
})

app.get('/info', (request, response) => {
  const count = details.length;
  const info = `Puhelinluettelossa on ${count} henkilön tiedot`;
  const date = new Date();
  date.toUTCString;
  response.send(`<p>${info}</p><p>${date}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = details.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  details = details.filter(person => person.id !== id);

  response.status(204).end();
})

app.post('/api/persons/', (request, response) => {
  const person = request.body;
  if (details.find(det => det.name === person.name)) {
    const err = {
      error: 'name must be unique'
    }
    return response.status(400).json(err);
  } else if (person.name && person.number) {
    person.id = Math.floor(Math.random() * (100000))
    details = details.concat(person)

    response.json(person);
  } else {
    const err = {
      error: 'name or number missing'
    }
    return response.status(400).json(err);
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})