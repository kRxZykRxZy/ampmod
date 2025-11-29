import React from 'react';
import styles from './spinner.css';

const Loading = ({isWhite, bare}) => (
    <div className={!bare && styles.container}>
        <div className={`${styles.spinner} ${isWhite ? styles.spinnerWhite : ''}`} />
    </div>
);

export default Loading;
