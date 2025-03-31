import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from 'dotenv';
config();
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// Middlewares
// Built-In
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Third-Party client access 
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods:["GET","POST"],
    allowedHeaders:["Content-Type","Authorization"],
  })
);
// app.use(cors())
app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});
app.use(morgan('dev'));
app.use(cookieParser());

// Server Status Check Route
app.get('/ping', (_req, res) => {
  res.send('Pong');
});

// Import all routes
import userRoutes from './routes/user.route.js';


// app.use("api/trainee",traineeRequestRoutes);
app.use('/api/user', userRoutes);

// Default catch all route - 404
app.all('*', (_req, res) => {
  res.status(404).send('OOPS!!! 404 Page Not Found');
});

// Custom error handling middleware
app.use(errorMiddleware);

export default app;


