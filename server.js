const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/moneyDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a Transaction schema
const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  const transactions = await Transaction.find();
  res.render('index', { transactions });
});

app.get('/transaction/:transactionId', async (req, res) => {
  const transactionId = req.params.transactionId;
  const transaction = await Transaction.findById(transactionId);
  res.render('transaction', { transaction });
});

app.get('/transactionForm/', async (req, res) => {
  const transactions = await Transaction.find();
  res.render('transactionForm', { transactions });
});

app.post('/addTransaction', async (req, res) => {
  const { description, amount } = req.body;
  
  const newTransaction = new Transaction({ description, amount });
  
  try {
    await newTransaction.save();
    res.render('transactionSuccess');
  } catch (error) {
    res.status(500).send('Error adding transaction');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
