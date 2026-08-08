const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

async function test() {
  try {
    const data = new FormData();
    data.append('items', JSON.stringify([{ product: '60d5ecb8b392d700153ee61e', quantity: 1 }]));
    data.append('shippingAddress', JSON.stringify({ fullName: 'test', phone: '1234567890', street: 'test', city: 'test', pincode: '123' }));
    data.append('location', JSON.stringify({ latitude: 0, longitude: 0 }));
    data.append('paymentMethod', 'upi');
    data.append('paymentTime', '19:35');

    console.log('Sending request to production...');
    const res = await axios.post('https://pawan-enterprises-shop.vercel.app/api/orders', data, {
      headers: { ...data.getHeaders() } 
    });
    console.log(res.data);
  } catch (err) {
    console.error('STATUS:', err.response?.status);
    console.error('DATA:', err.response?.data);
    if (typeof err.response?.data === 'string' && err.response.data.includes('html')) {
      console.error('HTML Response detected!');
    }
    console.error('MESSAGE:', err.message);
  }
}
test();
