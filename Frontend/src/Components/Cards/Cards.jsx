import React from 'react';
import styles from './Cards.module.css'
const Cards = ({webSearch}) => {

    return (
        <>
            <div className={styles.webSearchWorkContainer}>
               {webSearch.length > 0 && webSearch.map(webdata => (
                    <div className={styles.webSearchWork} onClick={() => window.open(webdata.url, '_blank')}>
                        <span>{webdata.title}</span>
                        <div class={styles.cardFooter}>
                            <img src={`https://www.google.com/s2/favicons?sz=64&domain=${webdata.url}`} alt="Website Logo" class={styles.websiteLogo} />
                            <span class={styles.websiteName}>{new URL(webdata.url).hostname}</span>
                        </div>
                    </div>
                    ))}
            </div>
        </>
    );
}

export default Cards;
