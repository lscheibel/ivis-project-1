import React, { useRef } from 'react';
import { DataEntry } from '../../assets/data';
import DashboardCard from '../DashboardCard/DashboardCard';
import styles from './SkillRadarCard.module.scss';
import SkillRadarChart from './SkillRadarChart';
import { useDomNodeDimensions } from '../../utils/useDomNodeDimensions';

export interface SkillRadarCardProps {
    data: DataEntry[];
}

const SkillRadarCard = ({ data }: SkillRadarCardProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const dimensions = useDomNodeDimensions(ref);

    return (
        <DashboardCard
            title={'Group Max Skill Set'}
            help={
                <>
                    <p>Visualizes the maximum skill per category of the group&apos;s members.</p>
                    <p>
                        Exact values are not important — use this chart to get a quick overview of what the group is
                        capable of.
                    </p>
                </>
            }
            style={{ gridArea: 'skills', background: 'var(--off-white)', aspectRatio: '1 / 1' }}
        >
            <div className={styles.wrapper} ref={ref}>
                {dimensions && <SkillRadarChart data={data} width={dimensions.width} height={dimensions.height} />}
            </div>
        </DashboardCard>
    );
};

export default SkillRadarCard;
