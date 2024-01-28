import React from 'react';
import styles from './Credits.module.scss';

const Credits = () => {
    return (
        <span className={styles.span}>
            Made with ❤️‍🔥 by <a href={'https://lennardscheibel.de'}>Lennard Scheibel</a> —{' '}
            <a href={'https://github.com/lscheibel/ivis-project-1'}>Source</a>
        </span>
    );
};

export default Credits;
