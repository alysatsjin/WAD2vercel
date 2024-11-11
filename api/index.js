
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
var path = require('path')
app.set('view engine', 'ejs')

app.use(express.static('public'));

app.use(cors({
    // origin: 'http://localhost:3001', // Allow your frontend URL rawr
    origin: 'wad2-vercel-ruddy.vercel.app',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true // Include if you need to allow cookies
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/checkout', async (req, res) => {

    const products = req.body.cartItems; // Expecting an array of product arrays

    // Format items according to Stripe's requirements
    const lineItems = products.map(product => ({
        price_data: {
            currency: 'sgd', // or your desired currency
            product_data: {
                name: product[1], // Product name
                // Optional: Add images or descriptions if needed
                images: [product[0]]// Assuming you want to include the image
            },
            unit_amount: Math.round(product[2] * 100), // Price in cents
        },
        quantity: product[5], // Quantity from your data
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/success`,
        cancel_url: `${process.env.BASE_URL}/cancel`
    });

    // Send session URL to client to handle the redirect
    res.json({ url: session.url });

});

app.get('/success', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public/success.html'))
})

app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/cart.html'));
})

app.listen(3001, () => console.log('Server started on port 3001'));

module.exports = app;
