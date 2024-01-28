import React from 'react';
import styles from './Credits.module.scss';

const Credits = () => {
    return (
        <span className={styles.span}>
            Made with ❤️‍🔥 by <a href={'https://lennardscheibel.de'}>Lennard Scheibel</a>
        </span>
    );
};

export default Credits;
