// ChatsLayout.jsx - with updated logic for new chat
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import styles from './ChatsLayout.module.css';
import InputBar from '../../Components/InputBar/InputBar';
import useChatHooks from '../../Hooks/LLMChatHook/useChatHooks';
import { clearActiveChat } from '../../features/chat/chatSlice';

const UserAndLLmChats = lazy(() => import('../../Components/UserAndLLmChats/UserAndLLmChats'));

const LoadingSpinner = () => (
    <div className="loading-container">
        <div className="spinner"></div>
    </div>
);

const ChatsLayout = () => {
    const { chatId } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.userDetails.userId);
    const messagesFromStore = useSelector((state) => state.chat.activeMessages || []);
    const activeChatId = useSelector((state) => state.chat.activeChatId);
    
    const { fetchResponse, getChatHistory, isLoading } = useChatHooks(userId);
    const [input, setInput] = useState('');
    const [isSelected, setIsSelected] = useState(false);

    // Handle URL changes and chat loading
    useEffect(() => {
        // If we have a chatId in the URL, load that chat
        if (chatId) {
            if (chatId !== activeChatId) {
                getChatHistory(chatId);
            }
        } 
        // If we're at the base /chat route, make sure active chat is cleared
        else if (location.pathname === '/chat') {
            // Only clear if we currently have an active chat
            if (activeChatId) {
                dispatch(clearActiveChat());
            }
        }
    }, [chatId, activeChatId, location.pathname, getChatHistory, dispatch]);

    const handleSend = async (webSearchEnabled) => {
        if (input.trim()) {
            const userInput = input.trim();
            await fetchResponse(userInput, webSearchEnabled);
            setInput('');
        }
    };

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <div className={styles.dashboardContainer}>
                <div className={styles.llmChat}>
                    <UserAndLLmChats
                        messages={messagesFromStore}
                        isLoading={isLoading}
                        isSelected={isSelected}
                    />
                </div>
                <div className={styles.inputBar}>
                    <div className={styles.inputBarContainer}>
                        <InputBar
                            input={input}
                            setInput={setInput}
                            handleSend={handleSend}
                            isLoading={isLoading}
                            setIsSelected={setIsSelected}
                            isSelected={isSelected}
                        />
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default ChatsLayout;