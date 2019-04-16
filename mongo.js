require('dotenv').config()
const mongoose = require('mongoose')

if ( process.argv.length < 3) { // aaah so this is how you give a parameter from commandline
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2];
// third param

const url = `mongodb+srv://fullstack:${password}@cluster0-mbkbd.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  const Person = mongoose.model('Persons', personSchema);

if ( process.argv.length === 3) {
    console.log("puhelinluettelo:")
    Person.find({}).then(result => {
        result.forEach(listing => {
            console.log(`${listing.name} ${listing.number}`);
        })
        mongoose.connection.close();
        process.exit(1);
    })
}

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({
    name: name,
    number: number,
})

person.save().then(response => {
    console.log(`lisätään ${name} numero ${number} luetteloon`);
    mongoose.connection.close();
})

