const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const Landscape = require('../models/landscape');
const cities = require('./cities');
const {places, descriptors} = require('./seedsHelper');

mongoose.connect('mongodb://localhost:27017/landto');
mongoose.connection.on('error', err => { logError(err) });
mongoose.connection.once('open', () => {
    console.log('CONNECTED')
});

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const seedDB = async () => {
    await Landscape.deleteMany({});
    for (let i = 0; i < 20; i++) {
        var random = Math.floor(Math.random() * 500);
        var landscape = new Landscape({
            user: '623bef6d8cf0066f8b157afc',
            title: `${sample(places)} ${sample(descriptors)}`,
            location: `${cities[random].city}, ${cities[random].admin_name}`,
            description: 'blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah ',
            images: [
                {
                  url: 'https://landto.s3.us-west-1.amazonaws.com/1648628311695',
                  key: '1648518670031'                
                }
              ],
        })
        await landscape.save();
    }
}

seedDB();