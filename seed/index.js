const mongoose = require('mongoose');
const House = require('../models/house');
const city = require('./city');

//const db_url = process.env.DB_URL || 'mongodb://localhost:27017/houseOnRent';
const db_url = 'mongodb+srv://house-renting-app-user1:0l4MfJORGRTIY9yO@cluster0.indgh.mongodb.net/houseRentingApplication?retryWrites=true&w=majority'
mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Success");
});


const nameArray = [
  "Mohit Sharma",
  "Himanshu Sharma",
  "Karan",
  "Vaishnav",
  "Divij",
  "Kapil",
  "Aakash",
  "Harsh",
  "Rohan",
  "Khyatee",
  "Harikesh"
];

const desArray = [
  "3BHK",
  "2BHK",
  "Luxurious",
  "4BHK",
  "1BHK",
  "Sharing",
  "Villa",
  "24*7 Electricity",
  "24*7 Water Supply",
  "Market available nearby",
  "Close to Hospital",
];

const sample = (array) => array[Math.floor(Math.random()*array.length)]; 

const seedDB = async() => {
  await House.deleteMany({});
  for(let i=0; i<100;i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random()*10000) + 10000;
    const house = new House({
      owner: '601d66831f39cf4bac825c2b',
      name: sample(nameArray),
      address: `${city[random1000].city}, ${city[random1000].state}`,
      geometry: {
        type: "Point",
        coordinates: [
            city[random1000].longitude,
            city[random1000].latitude,
        ]
    },
      rent: price,
      description: 'This is a dummy house for testing purpose!!!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!'
    });
    await house.save();
  }
}

seedDB().then(()=>{
  db.close();
});


