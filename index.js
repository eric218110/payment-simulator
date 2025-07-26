import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

app.post('/braintree/transactions', (req, res) => {
  console.log('request in /braintree/transactions', req.headers['user-agent']);

  const fail = Math.random() < 0.1;
  const { amount = '', currency = '', statementDescriptor = '' } = req.body;

  const response = {
    id: uuidv4(),
    date: new Date().toISOString(),
    status: fail ? 'failed' : 'paid',
    amount,
    originalAmount: amount,
    currency,
    statementDescriptor,
    paymentType: 'card',
    cardId: uuidv4(),
  };

  if (response.status === "failed") {
    res.status(400).json(response);
    return
  }

  res.json(response);
});

app.post('/stripe/charges', (req, res) => {
  console.log('request in /stripe/charges', req.headers['user-agent']);

  const fail = Math.random() < 0.1;
  const { amount = '', currency = '', description = '' } = req.body;

  const response = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: fail ? 'failed' : 'authorized',
    originalAmount: amount,
    currentAmount: amount,
    currency,
    description,
    paymentMethod: 'card',
    cardId: uuidv4(),
  };

  if (response.status === "failed") {
    res.status(400).json(response);
    return
  }

  res.json(response);
});

// 👇 Correção importante: compatível com Render, Railway, etc.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
