// SiderbarLayout.jsx
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from 'react-redux';
import SideBar from "../../Components/SideBar/SideBar";
import { clearActiveChat } from '../../features/chat/chatSlice';

function SiderbarLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const createNewChat = useCallback(() => {
        // Clear the active chat first
        dispatch(clearActiveChat()); 
        
        // Then navigate to the base chat route
        // Use replace to avoid building up history stack
        navigate('/chat', { replace: true });
    }, [navigate, dispatch]);

    return (
        <div style={{ 
            width: "100%", 
            height: "100%", 
            backgroundColor: "#f5f6fa", 
            padding: "36px 1px", 
            display: "flex", 
            flexDirection: "column", 
            position: 'relative',
        }}>
            {/* New Chat Button */}
            <div style={{padding: '2rem 2.3rem'}}> 
                <Button 
                    type="primary" 
                    icon={<MessageOutlined />} 
                    onClick={createNewChat} 
                    block
                    style={{ 
                        backgroundColor: "rgb(220 236 255)", 
                        color: "#3b82f6", 
                        fontWeight: "bold", 
                        borderRadius: "18px", 
                        border: "none",
                        padding: "18px 2px", 
                    }}
                >
                    New Chat
                </Button>
            </div>

            <SideBar />

            {/* Bottom Section */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '11%', right: '11%'}}>
                <Button 
                    type="text" 
                    icon={<UserOutlined />} 
                    block
                    style={{ fontWeight: "bold", color: "#1a1a1a", background: 'rgb(220 236 255)' }}
                >
                    My Profile
                </Button>
            </div>
        </div>
    );
}

export default React.memo(SiderbarLayout);