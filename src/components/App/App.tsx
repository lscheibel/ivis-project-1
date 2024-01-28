import React, { useState } from 'react';
import DataSelection from '../DataSelection/DataSelection';
import { data } from '../../assets/data';
import DataDashboard from '../DataDashboard/DataDashboard';
import sampleSize from 'lodash/sampleSize';
import range from 'lodash/range';
import styles from './App.module.scss';
import Credits from '../Credits/Credits';

const App = () => {
    const [dataLens, setDataLens] = useState<number[]>(() => sampleSize(range(data.length), 5));

    return (
        <div className={styles.wrapper}>
            <span className={styles.sizeDisclaimer}>Sorry, this app is best viewed on a larger screen 😬</span>
            <DataSelection value={dataLens} onChange={setDataLens} />
            {dataLens.length > 0 ? (
                <DataDashboard data={dataLens.map((i) => data[i])} />
            ) : (
                <span style={{ textAlign: 'center' }}>select some scholars to compare.</span>
            )}
            <Credits />
        </div>
    );
};

export default App;
