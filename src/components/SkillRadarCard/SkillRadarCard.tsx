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
            title={'Group Skill Set'}
            help={
                <>
                    <p>
                        Visualizes the maximum, minimum and average skill score per category of the group&apos;s
                        members.
                    </p>
                    <p>
                        Exact values are not important — use this chart to get a quick overview of what the group is
                        capable of. For details, check the Skill Distribution chart.
                    </p>
                </>
            }
            style={{ gridArea: 'skills', background: 'var(--off-white)', aspectRatio: '1 / 1' }}
        >
            <div className={styles.wrapper} ref={ref}>
                {dimensions && <SkillRadarChart data={data} width={dimensions.width} height={dimensions.height} />}
            </div>
            <div className={styles.legend}>
                <div className={styles.legendLabel}>
                    <svg width={16} height={16} viewBox={'0, 0, 16, 16'}>
                        <line x1={0} x2={16} y1={8} y2={8} stroke={'var(--black)'} strokeWidth={3} />
                    </svg>
                    <span>max/min</span>
                </div>
                <div className={styles.legendLabel}>
                    <svg width={16} height={16} viewBox={'0, 0, 16, 16'}>
                        <line
                            x1={0}
                            x2={16}
                            y1={8}
                            y2={8}
                            stroke={'var(--black)'}
                            strokeWidth={3}
                            strokeDasharray={'6px 4px'}
                        />
                    </svg>
                    <span>average</span>
                </div>
            </div>
        </DashboardCard>
    );
};

export default SkillRadarCard;
