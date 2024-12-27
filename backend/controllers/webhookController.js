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

        switch (evt.type) {
            case 'user.created':
                const { id, ...attributes } = evt.data;
                const newUser = new User({
                    clerkUserId: id,
                    firstName: attributes.first_name,
                    lastName: attributes.last_name
                });
                await newUser.save();
                console.log('User saved to database:', newUser);
                res.status(200).json({ success: true, message: 'User created and saved successfully' });
                break;
            
            case 'user.deleted':
                const deletedUser = await User.findOneAndDelete({ clerkUserId: evt.data.id });
                console.log('User deleted from database:', deletedUser);
                res.status(200).json({ success: true, message: 'User deleted successfully' });
                break;

            case 'user.updated':
                const updatedUser = await User.findOneAndUpdate(
                    { clerkUserId: evt.data.id },
                    { $set: { firstName: evt.data.first_name, lastName: evt.data.last_name } },
                    { new: true }
                );
                console.log('User updated in database:', updatedUser);
                res.status(200).json({ success: true, message: 'User updated successfully' });
                break;

            // Add more case blocks for other event types as necessary
            default:
                res.status(200).json({ success: true, message: 'Received webhook, but no action needed' });
                break;
        }
    } catch (err) {
        console.error('Error handling webhook:', err.message);
        res.status(400).json({ success: false, message: 'Webhook processing failed: ' + err.message });
    }
};

module.exports = { handleClerkWebhook };
