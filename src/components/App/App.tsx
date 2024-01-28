import React from 'react';
import DataSelection from '../DataSelection/DataSelection';
import { data } from '../../assets/data';
import DataDashboard from '../DataDashboard/DataDashboard';
import styles from './App.module.scss';
import Credits from '../Credits/Credits';
import { setGroupMembers, useGroupMembers } from '../../state/groupMembers';

const App = () => {
    const dataLens = useGroupMembers();

    return (
        <div className={styles.wrapper}>
            <span className={styles.sizeDisclaimer}>Sorry, this app is best viewed on a larger screen 😬</span>
            <DataSelection value={dataLens} onChange={setGroupMembers} />
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
