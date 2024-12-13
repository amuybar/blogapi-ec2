import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index_routes';
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Middleware Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after some time."
});

// Middleware Setup
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: ['https://nairobidossier.co.ke', 'https://www.nairobidossier.co.ke'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(morgan('dev'));
app.use(bodyParser.json());

// Custom Blocked Requests Middleware
app.use((req, res, next) => {
  const blockedPattern = '/LabTech/agent.aspx';
  
  if (req.url.includes(blockedPattern)) {
    res.status(403).end(); // Block specific requests
  } else {
    next();
  }
});

// Routes
routes(app);

// Default Route
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Blog APIs' });
});

// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Log Middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
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
