const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors')
const bcrypt=require("bcrypt")
const { initializeApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')
const { getFirestore } = require('firebase/firestore')

const handleCSV = require('./controls/handleCSV');
const createAccount = require('./controls/createAccount');
const handleDonationsRequest = require('./controls/handleDonationsRequest')
const handleDonorsRequest = require('./controls/handleDonorsRequest')
const handleSingleDonorRequest = require('./controls/handleSingleDonorRequest')
const handleDashboardRequest = require('./controls/handleDashboardRequest')
const handleLapsedGiftRequest = require('./controls/handleLapsedGiftRequest')
const handleLocationsRequest = require('./controls/handleLocationsRequest')
const { create } = require('domain');

const firebaseConfig = {
    apiKey: "AIzaSyD4HayiLOlVvBFRLEpUOF66JeD_byNlvxg",
    authDomain: "fundraising-management-program.firebaseapp.com",
    projectId: "fundraising-management-program",
    storageBucket: "fundraising-management-program.appspot.com",
    messagingSenderId: "301117335029",
    appId: "1:301117335029:web:a4e26cd3bdbb7ac0f96cbc",
    measurementId: "G-VPRR8S21WJ"
  };
  
// Initialize
const fbapp = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore();

const app = express()
app.use(cors())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.text({ type: 'text/plain' }))



//Create Account
app.post('/register', createAccount(db))


//reveiving csv upload
app.post('/file', handleCSV(db))

//grabbing donations
app.post('/donations', handleDonationsRequest(db))

//donors data
app.post('/donors', handleDonorsRequest(db))

//single donor data
app.post('/donorinfo', handleSingleDonorRequest(db))

//dashboard data
app.post('/dashboard', handleDashboardRequest(db))

//lapsed gifts
app.post('/lapsedgift', handleLapsedGiftRequest(db))

//states
app.post('/locations', handleLocationsRequest(db))

app.listen(3000, ()=> {
	console.log('app is running on port 3000')
})


