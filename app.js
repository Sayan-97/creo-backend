const express = require('express');
const mongoose = require('mongoose');
const clientRouter = require('./routes/clientRoutes');
const freelancerRouter = require('./routes/freelancerRoutes');
const jobsRouter = require('./routes/jobsRoutes')
const cors = require('cors')

const app = express();

app.use(cors())

require("dotenv").config();

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});


// Middleware
app.use(express.json());

// Routes
app.use('/api/client', clientRouter);
app.use('/api/freelancer', freelancerRouter);
app.use('/api', jobsRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
