const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const wishRoutes = require('./routes/wishes');
const batchCardRoutes = require('./routes/batchCard');
const tributeRoutes = require('./routes/tributes');
const collageRoutes = require('./routes/collages');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/wishes', wishRoutes);
app.use('/api/batch-card', batchCardRoutes);
app.use('/api/tributes', tributeRoutes);
app.use('/api/collages', collageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));