import React, { useRef, useState } from 'react';
import DashboardCard from '../DashboardCard/DashboardCard';
import { computed, DataEntry } from '../../assets/data';
import AverageSkillScoreViolinChart from '../AverageSkillScoreViolinChart/AverageSkillScoreViolinChart';
import { useDomNodeDimensions } from '../../utils/useDomNodeDimensions';
import styles from './AverageSkillScoreViolinCard.module.scss';
import cn from 'classnames';

export interface AverageSkillScoreViolinCardProps {
    data: DataEntry[];
}

const AverageSkillScoreViolinCard = ({ data }: AverageSkillScoreViolinCardProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const dimensions = useDomNodeDimensions(ref);

    const allSkills = ['meanSkillScore', ...data[0].allSkills.keys()];
    const [activeSkill, setActiveSkill] = useState('meanSkillScore');

    return (
        <DashboardCard
            title={'Skill Distribution'}
            help={
                <>
                    <p>Gives an overview of the skill distribution within the group.</p>
                    <p>
                        In the background you can see the skill distribution for the selected category for all people.
                    </p>
                </>
            }
            style={{ gridArea: 'averageSkillScore' }}
        >
            <div className={styles.wrapper} ref={ref}>
                {dimensions && (
                    <AverageSkillScoreViolinChart
                        skill={activeSkill}
                        data={data}
                        width={dimensions.width}
                        height={dimensions.height}
                    />
                )}
            </div>
            <div className={styles.skillButtonWrapper}>
                {allSkills.map((skill) => {
                    return (
                        <button
                            className={cn(styles.skillButton, { [styles.active]: skill === activeSkill })}
                            key={skill}
                            onClick={() => setActiveSkill(skill)}
                        >
                            {(computed.skillLabels as any)[skill]}
                        </button>
                    );
                })}
            </div>
        </DashboardCard>
    );
};

export default AverageSkillScoreViolinCard;
