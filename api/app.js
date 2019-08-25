// const express = require('express');


import express from 'express';

const app = express();
app.get('/', (req, res) => console.log('Hello express'));
app.get('/greet', (req, res) => {
 res.json('Greeting from nodejs');
});

app.listen('3000', (req, res) => console.log('listenting on port number 3000'));
