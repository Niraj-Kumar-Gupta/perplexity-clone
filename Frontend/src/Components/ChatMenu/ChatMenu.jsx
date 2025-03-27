import { Menu, Divider } from "antd";
import { memo } from "react";

const ChatMenu = memo(({ chats, navigate, currentChatId }) => {
  return (
    <Menu 
      mode="inline" 
      selectedKeys={[currentChatId]} 
      style={{ 
        flex: 1, 
        overflowY: "auto", 
        backgroundColor: "transparent", 
        border: "none", 
        padding: "0rem 1rem" 
      }}
    >
      {Object?.entries(chats)?.map(([category, chatList]) => {
        if (chatList.length === 0) return null;

        return (
          <div key={category}>
            <Divider style={{ margin: "22px 0" }} />
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#6b7280", marginBottom: "18px" }}>
              {category === "today" ? "Today" : category === "last7Days" ? "Last 7 Days" : "Last 30 Days"}
            </div>
            {chatList.map((chat) => (
              <Menu.Item
                key={chat.chatId}
                onClick={() => navigate(chat.chatId)}
                style={{ 
                  backgroundColor: chat.chatId === currentChatId ? '#d8dcf1' : "transparent", 
                  color: "#1a1a1a",
                  padding:'0rem 0.5rem'
                }}
              >
                {chat.title}
              </Menu.Item>
            ))}
          </div>
        );
      })}
    </Menu>
  );
});

export default ChatMenu;