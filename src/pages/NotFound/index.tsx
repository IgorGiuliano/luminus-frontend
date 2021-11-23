import React from 'react';
import styles from './styles.module.scss';


const NotFound: React.FC = () => {
    window.location.href='http://localhost:3000'
    return (
        <div className={styles.homeWrapper}>
        </div>
    )
}

export default NotFound;