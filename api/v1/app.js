import express from 'express';
import mocha from 'mocha';
import path from 'path';
import userRouter from './routes/user';
import propertyRouter from './routes/property';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/property', propertyRouter);
const port = process.env.PORT | 5000;


// error middleware functions
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => { // get the error from above middleware
  res.status(error.status || 500);
  res.json({
    status: 'error',
    error: error.message,
  });
});

// make a static folder for property images to  be public using a middleware
app.use('/uploads', express.static('uploads'));

app.listen(port, (req, res) => console.log(`listenting on port ${port} `));

export default app;
