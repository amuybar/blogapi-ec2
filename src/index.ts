import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index_routes';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
routes(app);

// Default route
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Blog APIs' });
});

// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// General Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
