import { Handler } from '@netlify/functions';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { getAPIKeys } from '../../src/services/admin/apiKeys';
import { getChatResponse } from '../../src/services/api';
import { PAYMENT_CONFIG } from '../../src/services/payment/config';

const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Agent-ID, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');

  try {
    // Create Payment Intent
    if (path === '/create-payment-intent' && event.httpMethod === 'POST') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing request body' })
        };
      }

      const { provider, amount } = JSON.parse(event.body);

      if (!provider || !amount) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required payment information' })
        };
      }

      let paymentIntent;
      switch (provider) {
        case 'stripe':
          // Create Stripe payment intent
          const stripe = require('stripe')(process.env.VITE_STRIPE_SECRET_KEY);
          paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd'
          });
          break;

        case 'razorpay':
          // Create Razorpay order
          const Razorpay = require('razorpay');
          const razorpay = new Razorpay({
            key_id: process.env.VITE_RAZORPAY_KEY_ID,
            key_secret: process.env.VITE_RAZORPAY_KEY_SECRET
          });
          paymentIntent = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: 'INR'
          });
          break;

        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid payment provider' })
          };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(paymentIntent)
      };
    }

    // Other existing endpoints...
    // (Keep the rest of your existing endpoint handlers)

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

export { handler };