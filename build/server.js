import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 6857;

app.use(cors({
  origin: '*'
}));

const options = {
  setHeaders: (res, path, stat) => {
    res.set('x-timestamp', Date.now());
    res.set('Cache-control', 'no-cache');
  }
};

app.use('/', express.static('dist', options));

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})
