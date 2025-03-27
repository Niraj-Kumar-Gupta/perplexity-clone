import React, { useEffect, useRef, useState } from 'react';
import styles from './InputBar.module.css';
import { FaArrowAltCircleUp, FaStopCircle } from "react-icons/fa";
import { LuPaperclip } from "react-icons/lu";
import { TbWorldUpload } from "react-icons/tb";
import { RiImageAddLine } from "react-icons/ri";
import { IoCloseCircle } from "react-icons/io5";
import { Tooltip } from 'antd';


const InputBar = ({ input, setInput, handleSend, isLoading ,setIsSelected,isSelected }) => {
    const inputRef = useRef(null);
    const [images, setImages] = useState([]);
    
    const toggleSelection = () => {
        setIsSelected((prev) => !prev);
      };

    const handlePaste = (e) => {
        const clipboardItems = e.clipboardData.items;
        let hasImage = false;

        for (let i = 0; i < clipboardItems.length; i++) {
            if (clipboardItems[i].type.startsWith('image/')) {
                hasImage = true;
                const blob = clipboardItems[i].getAsFile();
                const reader = new FileReader();

                reader.onload = (event) => {
                    setImages((prevImages) => [...prevImages, event.target.result]);
                };
                reader.readAsDataURL(blob);
            }
        }

        if (!hasImage) {
            return; 
        }
        e.preventDefault(); 
    };

    const handleUpload = (e) => {
        const files = e.target.files;

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImages((prevImages) => [...prevImages, event.target.result]);
            };
            reader.readAsDataURL(files[i]);
        }
    };

    const handleDeleteImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const adjustHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = '1.7rem';
            const scrollHeight = inputRef.current.scrollHeight;
            const maxHeight = parseInt(getComputedStyle(inputRef.current).maxHeight, 15);

            if (scrollHeight > maxHeight) {
                inputRef.current.style.height = `${maxHeight}px`;
            } else {
                inputRef.current.style.height = `${scrollHeight}px`;
            }
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [input]);

    return (
        // <div className={styles.inputBarContainer}>
            <div className={styles.inputBar}>
                
                {/* Image Preview Section */}
                <div className={styles.imageWrapper}>
                    {images.map((image, index) => (
                        <div key={index} className={styles.imageContainer}>
                            <img src={image} alt={`Image ${index + 1}`} className={styles.images} />
                            <IoCloseCircle
                                className={styles.deleteIcon}
                                onClick={() => handleDeleteImage(index)}
                            />
                        </div>
                    ))}
                </div>

                {/* Input Field Section */}
                <div className={styles.inputWrapper}>
                    <div className={styles.inputBoxContainer}>
                        <textarea
                            ref={inputRef}
                            placeholder="Type your message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={async(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    await handleSend(isSelected);
                                }
                            }}
                            onPaste={handlePaste}
                            className={styles.inputField}
                            rows={1}
                        />
                    </div>

                    {/* Icons Section */}
                    <div className={styles.iconBoxContainer}>
                        <div className={styles.iconBoxLeftContainer}>
                         <Tooltip title="This service is not available" placement="left"> 
                            <label htmlFor="fileUpload" className={styles.webSearchContainer}>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    onChange={handleUpload}
                                    multiple
                                    className={styles.hiddenInput}
                                    disabled={true}
                                />
                                <LuPaperclip className={`${styles.scanIcon} ${styles.icons}`} />
                                <span>Upload</span>
                              </label>
                              </Tooltip>

                             <Tooltip title="Search the web on necessary" placement="right" >
                                 <div 
                                 className={`${styles.webSearchContainer} ${isSelected ? styles.selected : ""}`}
                                 onClick={toggleSelection}
                                 >
                                    <TbWorldUpload className={`${styles.scanIcon} ${styles.icons}`} />
                                    <span>Search</span>   
                                </div>
                             </Tooltip>
                            
                        </div>
                        <div className={styles.iconBoxRightContainer}>
                            {/* <button onClick={handleSend} className={styles.sendButton} disabled={isLoading}>
                                {isLoading ? <FaStopCircle className={styles.sendIcon} /> : <FaArrowAltCircleUp className={styles.sendIcon} />}
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        // </div>
    );
};

export default InputBar;
