import React, { useMemo } from 'react';
import styles from './DataSelection.module.scss';
import { computed, data } from '../../assets/data';
import Select, { OptionProps } from 'react-select';
import cn from 'classnames';
import sampleSize from 'lodash/sampleSize';
import range from 'lodash/range';

const DropdownIndicator = () => {
    return (
        <button className={styles.dropdownIndicator}>
            <span>v</span>
        </button>
    );
};

const colors = [
    '#FCF3F4',
    '#FAE6E9',
    '#F9DADD',
    '#F8CED0',
    '#F5C2C3',
    '#F2B6B6',
    '#F0AAA8',
    '#EC9E9B',
    '#E9918C',
    '#E6857E',
];

const Option = (props: OptionProps<any>) => {
    const entity = data[(props.data as any).value];
    const relativeSkillScore = entity.meanSkillScore / computed.maxSkillScore;
    const bgColor = colors[Math.floor(relativeSkillScore * colors.length)];

    return (
        <div className={styles.optionWrapper} ref={props.innerRef} {...props.innerProps}>
            <span className={styles.value}>{entity.alias}</span>
            <div className={styles.statsWrapper}>
                <div
                    className={styles.statsValue}
                    style={{ width: `${relativeSkillScore * 100}%`, background: bgColor }}
                >
                    <span>{entity.meanSkillScore.toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
};

export interface DataSelectionProps {
    value: number[];
    onChange: (value: number[]) => void;
}

const DataSelection = ({ value, onChange }: DataSelectionProps) => {
    const options = useMemo(() => {
        return [...data]
            .map((e, i) => ({ value: i, label: e.alias, data: e }))
            .sort((a, b) => a.data.meanSkillScore - b.data.meanSkillScore);
    }, []);

    const pickFiveRandom = () => {
        onChange(sampleSize(range(data.length), 5));
    };

    return (
        <div className={styles.container}>
            <span className={styles.counter}>
                A group of {value.length}{' '}
                <button className={styles.randomButton} onClick={pickFiveRandom}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0, 0, 24, 24"
                        style={{ transform: 'rotate(12deg)' }}
                    >
                        <title>Randomize</title>
                        <path
                            fill="currentColor"
                            d="M21 3H3v18h18V3zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z"
                        />
                    </svg>
                </button>{' '}
                {value.length === 1 ? 'person' : 'people'}.
            </span>
            <Select
                className={styles.select}
                classNames={{
                    control: () => styles.control,
                    valueContainer: () => cn(styles.valueContainer, 'hide-scrollbar'),
                    multiValue: () => styles.multiValue,
                    multiValueLabel: () => styles.multiValueLabel,
                    multiValueRemove: () => styles.multiValueRemove,
                    menu: () => styles.menu,
                    menuList: () => cn(styles.menuList, 'hide-scrollbar'),
                    option: () => styles.option,
                }}
                isClearable={false}
                components={{ DropdownIndicator, IndicatorSeparator: null, Option }}
                isMulti
                value={value.map((v) => ({ value: v, label: data[v].alias }))}
                onChange={(e) => onChange(e.map((e) => e.value))}
                options={options}
                closeMenuOnSelect={false}
            />
        </div>
    );
};

export default DataSelection;
