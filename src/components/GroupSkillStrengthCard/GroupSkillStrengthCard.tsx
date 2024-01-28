import React from 'react';
import { DataEntry } from '../../assets/data';
import DashboardCard from '../DashboardCard/DashboardCard';
import styles from './GroupSkillStrengthCard.module.scss';
import meltingFace from '../../assets/emojis/melting-face.png?url';
import thumbsUp from '../../assets/emojis/thumbs-up.png?url';
import okHand from '../../assets/emojis/ok-hand.png?url';
import muscle from '../../assets/emojis/muscle.png?url';
import mechanicalArm from '../../assets/emojis/mechanical-arm.png?url';
import crown from '../../assets/emojis/crown.png?url';

export interface GroupSkillStrengthCardProps {
    data: DataEntry[];
}

const GroupSkillStrengthCard = ({ data }: GroupSkillStrengthCardProps) => {
    const strength = data.reduce((acc, e) => acc + e.meanSkillScore, 0) / data.length;
    const labels = [
        { value: 0, text: 'weak', url: meltingFace, emoji: '🫠' },
        { value: 4, text: 'meh', url: meltingFace, emoji: '🫠' },
        { value: 4.5, text: 'okay', url: thumbsUp, emoji: '👍' },
        { value: 5, text: 'solid', url: okHand, emoji: '👌' },
        { value: 5.5, text: 'strong', url: muscle, emoji: '💪' },
        { value: 6, text: 'epic', url: mechanicalArm, emoji: '🦾' },
        { value: 6.5, text: 'almighty', url: crown, emoji: '👑' },
    ];

    const label = [...labels].reverse().find(({ value }) => strength >= value);

    return (
        <DashboardCard
            title={'Strength Evaluation'}
            help={'Evaluates the average skill score of the entire group.'}
            className={styles.card}
            style={{ gridArea: 'strengths', background: 'var(--off-white)' }}
        >
            {!label ? (
                'no data.'
            ) : (
                <>
                    <strong className={styles.result}>
                        {label.text}
                        <br />
                        group
                    </strong>
                    <img className={styles.emojiImg} src={label.url} alt={label.emoji} />
                </>
            )}
        </DashboardCard>
    );
};

export default GroupSkillStrengthCard;
