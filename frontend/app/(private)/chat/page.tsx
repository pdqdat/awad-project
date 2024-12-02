import type { Metadata } from "next";

import { appName } from "@lib/const";
import { Textarea } from "@ui/textarea";

export const metadata: Metadata = {
    title: `Chat with ${appName}`,
    description: "Chat with our AI to get personalized movie recommendations",
};

const ChatPage = () => {
    return (
        <div className="my-6 min-h-[32rem]">
            <div className="container">
                <h4 className="h4 mb-6">What can I help you with?</h4>
                <Textarea
                    placeholder="Send a message..."
                    className="max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-xl bg-muted text-base"
                    rows={3}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default ChatPage;
