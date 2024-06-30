const express = require('express');
const { createExpressApp } = require('./expressApp');

const app = express();
const port = 3001; 

createExpressApp(app,port);

