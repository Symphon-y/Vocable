require('dotenv').config()
const axios = require('axios').default;
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
const cron = require('cron');

const mongoose = require('mongoose');
var mongoURL = `mongodb+srv://VocableAdmin:${process.env.Vocable_Password}@vocable.jfxyo.mongodb.net/${process.env.Database}?retryWrites=true&w=majority`;
main().catch(err => console.log(err));

const randomWordOptions = {
  method: 'GET',
  url: 'https://random-words5.p.rapidapi.com/getRandom',
  headers: {
    'X-RapidAPI-Host': `${process.env.Random_Word_API_Host}`,
    'X-RapidAPI-Key': `${process.env.Random_Word_API_Key}`
  }
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  next();
});

async function main() {
  await mongoose.connect(mongoURL);
  const vocableSchema = new mongoose.Schema ({ word: String });
  const Vocable = mongoose.model('Vocable', vocableSchema);
  const vocables = await Vocable.find();
  var todaysVocable;

  console.log('Server connected to database...')

  let wordADay = new cron.CronJob('00 00 00 * * *', () => {

    axios.request(randomWordOptions).then(function (response) {
      todaysVocable = new Vocable({word: response.data})
      todaysVocable.save();
      console.log(todaysVocable);
    }).catch(function (error) {
      console.error(error);
    });
  });

  app.get('/test', function (req, res) {
    res.send(vocables[vocables.length-1])
  })

  wordADay.start();
}

app.post('/submittedword', function (req,res) {
  const dictionary_options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/definition/',
    params: {entry: `${req.body}`},
    headers: {
      'X-RapidAPI-Host': `${process.env.Dictionary_API_Host}`,
      'X-RapidAPI-Key': `${process.env.Dictionary_API_Key}`
    }
  };
  var resultToSend;

    axios.request(dictionary_options).then(function (response) {
      resultToSend = response.data;
      res.send(resultToSend);
    }).catch(function (error) {
      console.error(error);
    });

  });


app.listen(process.env.Express_Port, () => {
  console.log(`Express Server Listening on Port ${process.env.Express_Port}`)
})