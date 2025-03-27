import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SiderbarLayout from '../../Layout/SiderbarLayout/SiderbarLayout';
import { Layout } from 'antd';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import ChatsLayout from '../../Layout/ChatsLayout/ChatsLayout';


const { Header, Content, Sider } = Layout;

const SIDEBAR_WIDTH = 277; 
const COLLAPSED_WIDTH = 80;
const SIDEBAR_BG_COLOR = '#f8f8f8'; 

function GenAiChat() {
  const location = useLocation();
  const contentKey = location.pathname;


  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  

  return (
    <Layout>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={SIDEBAR_WIDTH}
        collapsedWidth={COLLAPSED_WIDTH}
        trigger={null}
        style={{
          overflow: "auto",
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          textAlign: "left",
          backgroundColor: SIDEBAR_BG_COLOR,
          zIndex: 999999,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: collapsed ? "20px" : "15px",
            cursor: "pointer",
            fontSize: "33px",
            zIndex: 1000,
            padding: "1px",
            borderRadius: "5px",
            transition: "background-color 0.3s ease-in-out",
            color: "gray",
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? 
          <TbLayoutSidebarRightCollapse /> 
            : <TbLayoutSidebarLeftCollapse />
          }
        </div>
        <SiderbarLayout />
      </Sider>
        
      <Layout style={{ 
        marginLeft: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        transition: "margin-left 0.2s"
      }}>
        <Header
          theme="light"
          style={{
            overflow: 'hidden',
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            backgroundColor: '#ffffff',
            zIndex: '99999',
          }}
        >
        </Header>
        <Content style={{ padding: '0px 0px'}}>
          <ChatsLayout key={contentKey} />
        </Content>
      </Layout>
    </Layout>
  );
}

export default GenAiChat;