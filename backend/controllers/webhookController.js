const { Webhook } = require('svix');
const User = require('../models/User');

const handleClerkWebhook = async (req, res) => {
    try {
        const secret = process.env.CLERK_WEBHOOK_SECRET_KEY;
        if (!secret) {
            throw new Error("CLERK_WEBHOOK_SECRET_KEY is not set in the environment variables.");
        }

        // Initialize the Webhook with the secret key
        const webhook = new Webhook(secret);

        // Verify the webhook payload and extract the event data
        const payloadString = req.body;  // Convert Buffer to string
        const evt = webhook.verify(payloadString, req.headers);
        
        console.log('Event type:', evt.type);
        console.log('Received event:', evt);

        if (evt.type === 'user.created') {
            const { id, ...attributes } = evt.data;
            const firstName = attributes.first_name;
            const lastName = attributes.last_name;

            // Create a new user and save to the database
            const newUser = new User({
                clerkUserId: id,
                firstName: firstName,  // Adjust these fields based on actual data structure
                lastName: lastName
            });

            await newUser.save();
            console.log('User saved to database:', newUser);

            res.status(200).json({ success: true, message: 'User created and saved successfully' });
        } else {
            res.status(200).json({ success: true, message: 'Received webhook, but no action needed' });
        }
    } catch (err) {
        console.error('Error handling webhook:', err.message);
        res.status(400).json({ success: false, message: 'Webhook processing failed: ' + err.message });
    }
};

module.exports = { handleClerkWebhook };
