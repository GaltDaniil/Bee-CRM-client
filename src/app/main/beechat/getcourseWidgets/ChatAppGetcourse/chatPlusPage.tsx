import react from 'react';
import MainSidebar from '../../../apps/chat/sidebars/main/MainSidebar';
import Chat from 'src/app/main/apps/chat/chat/Chat';
import ChatApp from 'src/app/main/apps/chat/ChatApp';
import ContactChatPage from '../contactChatFrame';

function ChatPlusPage() {
    return (
        <div className="flex">
            <MainSidebar />
            <ContactChatPage />
        </div>
    );
}

export default ChatPlusPage;
