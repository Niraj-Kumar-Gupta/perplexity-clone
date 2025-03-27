import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collapsed: false,
  lastScrollPosition: 0,
  chats: { today: [], last7Days: [], last30Days: [] },
  activeChatId: null,
  activeMessages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.collapsed = !state.collapsed;
    },
    setScrollPosition: (state, action) => {
      state.lastScrollPosition = action.payload;
    },
    setChats: (state, action) => {
      return{
        ...state,
        chats: action.payload,
      };
    },
    // setActiveChat: (state, action) => {
    //   state.activeChatId = action.payload.chatId;
    //   state.activeMessages = action.payload.messages || [];
    // },
    
    clearActiveChat: (state) => {
      state.activeChatId = null;
      state.activeMessages = [];
    },
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload.chatId;
      if (action.payload.messages) {
        state.activeMessages = action.payload.messages.map(msg => ({
          ...msg,
          isLoading: msg.isLoading ?? false,
          isStreaming: msg.isStreaming ?? false
        }));
      }
    },
  },
});

export const { setChats, setActiveChat, clearActiveChat , toggleSidebar, setScrollPosition } = chatSlice.actions;
export default chatSlice.reducer;
