import React, { CSSProperties, useState } from 'react';
import styles from './DashboardCard.module.scss';
import cn from 'classnames';

export interface DashboardCardProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    help?: React.ReactNode;
    style: CSSProperties;
    className?: string;
}

const DashboardCard = ({ children, title, help, style, className }: DashboardCardProps) => {
    const [helpOpen, setHelpOpen] = useState(false);
    const toggleHelp = () => setHelpOpen(!helpOpen);

    return (
        <div style={style} className={cn(styles.card, className)}>
            {title && <span className={styles.title}>{title}</span>}
            {children}
            {help && (
                <>
                    <button className={styles.helpButton} onClick={toggleHelp}>
                        ?
                    </button>
                    <div className={cn(styles.helpContainer, { [styles.open]: helpOpen })}>
                        <span className={styles.help}>{help}</span>
                        <button className={styles.helpDismiss} onClick={toggleHelp}>
                            okay
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardCard;
