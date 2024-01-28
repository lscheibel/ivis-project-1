import React from 'react';
import styles from './DataDashboard.module.scss';
import { D3BuilderArgs } from '../D3';
import * as d3 from 'd3';
import { DataEntry } from '../../assets/data';
import CommonInterestsCard from '../CommonInterestsCard/CommonInterestsCard';
import GroupSkillStrengthCard from '../GroupSkillStrengthCard/GroupSkillStrengthCard';
import SkillRadarCard from '../SkillRadarCard/SkillRadarCard';
import AverageSkillScoreViolinCard from '../AverageSkillScoreViolinCard/AverageSkillScoreViolinCard';

export interface DataDashboardProps {
    data: DataEntry[];
}

const DataDashboard = ({ data }: DataDashboardProps) => {
    return (
        <div className={styles.container}>
            {/*<D3 fn={meanSkillScoreBarChart} data={data} />*/}
            <CommonInterestsCard data={data} />
            <GroupSkillStrengthCard data={data} />
            <SkillRadarCard data={data} />
            <AverageSkillScoreViolinCard data={data} />
        </div>
    );
};

export default DataDashboard;
