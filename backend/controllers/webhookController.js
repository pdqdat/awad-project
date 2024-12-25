import { Webhook } from 'svix';
import User from '../models/User.js';

export const handleClerkWebhook = async (req, res) => {
    try {
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
        const evt = wh.verify(req.body.toString(), req.headers);
        
        if (evt.type === 'user.created') {
            const { id, first_name: firstName, last_name: lastName } = evt.data;
            const newUser = new User({ clerkUserId: id, firstName, lastName });
            await newUser.save();
            console.log('User saved to database:', newUser);
        }

        res.status(200).json({ success: true, message: 'Webhook received and processed' });
    } catch (err) {
        console.error('Error handling webhook:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};
