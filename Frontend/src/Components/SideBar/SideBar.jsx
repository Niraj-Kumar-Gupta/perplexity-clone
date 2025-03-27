import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useChatHooks from "../../Hooks/LLMChatHook/useChatHooks";
import { setChats ,setScrollPosition} from "../../features/chat/chatSlice";
import ChatMenu from "../ChatMenu/ChatMenu";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMountedRef = useRef(true);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userDetails.userId);
  const { getChatList } = useChatHooks(userId);
  const chats = useSelector((state) => state.chat.chats);
  
  const sidebarRef = useRef(null); 
  const lastScrollPosition = useSelector((state) => state.chat.lastScrollPosition);

  const currentChatId = location.pathname.includes("/chat/")
    ? location.pathname.split("/chat/")[1]
    : null;

  const categorizeChats = useCallback((chatList) => {
    if (!chatList || !Array.isArray(chatList)) return { today: [], last7Days: [], last30Days: [] };

    const today = [],
      last7Days = [],
      last30Days = [];
    const now = new Date();

    chatList.forEach((chat) => {
      if (!chat || !chat.lastUpdated) return;
      const chatDate = new Date(chat.lastUpdated);
      const daysDiff = Math.floor((now - chatDate) / (1000 * 60 * 60 * 24));

      if (daysDiff < 1) today.push(chat);
      else if (daysDiff < 7) last7Days.push(chat);
      else if (daysDiff < 30) last30Days.push(chat);
    });

    return { today, last7Days, last30Days };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const fetchChats = async () => {
      try {
        const chatList = await getChatList();
        console.log('Navigating...')
        if (isMountedRef.current && chatList) {
          dispatch(setChats(categorizeChats(chatList)));
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
    return () => {
      isMountedRef.current = false;
    };
  }, [getChatList, categorizeChats, dispatch]);

  const handleNavigate = useCallback(
    (chatId) => {
      if (chatId === currentChatId) return;
      console.log('Navigating...')
      navigate(`/chat/${chatId}`, { replace: true });
    },
    [navigate, currentChatId]
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = sidebarRef.current?.scrollTop || 0;
      dispatch(setScrollPosition(scrollTop));
    };

    const currentRef = sidebarRef.current;
    currentRef?.addEventListener('scroll', handleScroll);

    return () => currentRef?.removeEventListener('scroll', handleScroll);
  }, [dispatch])

  useEffect(() => {
    if (sidebarRef.current && lastScrollPosition !== undefined) {
      sidebarRef.current.scrollTop = lastScrollPosition;
    }
  }, [lastScrollPosition, currentChatId]);

  return (
    <div 
      ref={sidebarRef} 
      style={{ overflowY: 'auto', height: '100%' }} 
    >
      <ChatMenu 
        chats={chats} 
        navigate={handleNavigate} 
        currentChatId={currentChatId} 
      />
    </div>)
};

export default Sidebar;
