import React, { useState, useEffect, useRef } from 'react';
import styles from './UserAndLLmChats.module.css'
import ResponseFormater from '../ResponseFormater/ResponseFormater'
import UserMessageFormater from '../ResponseFormater/userMessageFormater';
import { GiArtificialHive } from "react-icons/gi";
import Cards from '../Cards/Cards';
import { FaAngleDown } from "react-icons/fa6";
import { FaChartBar, FaMagic, FaLightbulb, FaComments, FaTasks, FaFileAlt, FaCode } from "react-icons/fa";
import genailogo from '../../assets/artificial-intelligence-ai-icon.svg';
import { AiOutlineSlack } from "react-icons/ai";

const recentQuestions = [
    { text: "Analyze data", icon: <FaChartBar /> },
    { text: "Surprise me", icon: <FaMagic /> },
    { text: "Brainstorm", icon: <FaLightbulb /> },
    { text: "Get advice", icon: <FaComments /> },
    { text: "Make a plan", icon: <FaTasks /> },
    { text: "Summarize text", icon: <FaFileAlt /> },
    { text: "Code", icon: <FaCode /> },
];
const UserAndLLmChats = ({ messages , isSelected}) => {
   
    const chatEndRef = useRef(null);
    const [showInitialMessage, setShowInitialMessage] = useState(true);
    useEffect(() => {
        if (messages?.length > 0) {
            setShowInitialMessage(false);
        }
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
   
    const onRecentQuestionClick = (question) => {
        //setShowInitialMessage(false);
        //webSearch(question); // Assuming this function sends the question for processing
    };

    return (
        <div className={styles.chatBot}>
            {/* {showInitialMessage && (
                    <div className={styles.initialMessageContainer}>
                        <img src={genailogo} alt="GenAI Logo" className={styles.genaiLogo} />
                        <div className={styles.initialMessage}>
                             How can I assist you today?
                        </div>
                
                        <div className={styles.recentQuestionsBox}>
                            <p className={styles.recentQuestionsTitle}>Common Tasks:</p>
                            <div className={styles.recentQuestions}>
                            {recentQuestions.map((item, index) => (
                                <button key={index} className={styles.questionButton} onClick={() => onRecentQuestionClick(item.text)}>
                                    {item.icon} <span>{item.text}</span>
                                </button>
                            ))}
                       </div>
                    </div>
              </div>
             )} */}

            {messages && messages?.map((message) => (
                <div
                key={message._id || index}
                    className={`${styles.message} ${
                        message?.role === 'user' ? styles.userMessage : styles.aiMessage
                    }`}
                >
                    {/* AI Message Display */}
                    {message?.role ==='assistant' && (
                      <>
                        <span className={styles.aiLogoAndThinking}>
                            <GiArtificialHive className={styles.aiLogo} />
                            <span className={styles.thinking}>
                                 <AiOutlineSlack /><span> {message.isStreaming ? 'Analyzing...':`Here's the answer!✨`}</span></span>
                          </span>
                         <div className={styles.aiMessageContainer}>
                           {/* Display web search results if available */}
                            {message.webSearch && message.webSearch.length > 0 && (
                                <div>
                                    <h3>🔍 Comprehensive Web Search Results & Insights</h3>
                                    <p>Below is a list of trusted sources providing the latest information based on your search query:</p>
                                    {/* Pass the webSearch results to the Cards component */}
                                    <Cards webSearch={message?.webSearch} />
                                    <h3>LLM Response</h3>
                                    <hr></hr>
                                </div>
                                
                            )}
                            <div className={styles.aiText}>
                                
                                <ResponseFormater message={message?.content} role={message?.type} /> 
                                {message.isLoading && <span className={styles.fastCursor}></span>}
                            </div>
                         </div>
                       </>
                    )}

                    {/* User Message Display */}
                    {message?.role === 'user' && (
                        <div className={styles.userMessageContainer}>
                            <div className={styles.userText}>
                                <UserMessageFormater message={message?.content} role={message?.role}/>
                            </div>
                        </div>
                     )}
                       </div>
                  ))}

            <div ref={chatEndRef} className={styles.chatEnd} />
        </div>
    );
};


export default UserAndLLmChats;
