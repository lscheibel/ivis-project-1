import React, { useMemo } from 'react';
import styles from './DataSelection.module.scss';
import { computed, data } from '../../assets/data';
import Select, { OptionProps } from 'react-select';
import cn from 'classnames';

export interface DataSelectionProps {
    value: number[];
    onChange: (value: number[]) => void;
}

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

const DataSelection = ({ value, onChange }: DataSelectionProps) => {
    const options = useMemo(() => {
        return [...data]
            .map((e, i) => ({ value: i, label: e.alias, data: e }))
            .sort((a, b) => a.data.meanSkillScore - b.data.meanSkillScore);
    }, []);

    return (
        <div className={styles.container}>
            <span className={styles.counter}>
                A group of {value.length} awesome {value.length === 1 ? 'person' : 'people'}.
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
