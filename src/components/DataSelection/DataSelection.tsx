import React, { useMemo, useState } from 'react';
import styles from './DataSelection.module.scss';
import { computed, data, DataEntry } from '../../assets/data';
import Select, { MenuProps, OptionProps } from 'react-select';
import cn from 'classnames';
import sampleSize from 'lodash/sampleSize';
import range from 'lodash/range';
import { atom, useAtom } from 'react-atomic-state';

const sortByAtom = atom<keyof DataEntry>('meanSkillScore');

const DropdownIndicator = () => {
    return (
        <button className={styles.dropdownIndicator}>
            <span>v</span>
        </button>
    );
};

const colors = [
    '#F7DDDC',
    '#F6D4D2',
    '#F5C9C8',
    '#F3C0BD',
    '#F1B7B2',
    '#EFACA8',
    '#EDA39E',
    '#EB9994',
    '#E98F89',
    '#E6857E',
];

const Option = (props: OptionProps<any>) => {
    const sortBy = useAtom(sortByAtom);
    const entity = data[(props.data as any).value];
    const skillValue = entity[sortBy] as number;
    const relativeSkillScore = skillValue / computed.maxSkillScore;
    const bgColor = colors[Math.floor(relativeSkillScore * colors.length - 1)];

    return (
        <div className={styles.optionWrapper} ref={props.innerRef} {...props.innerProps}>
            <span className={styles.value}>{entity.alias}</span>
            <div className={styles.statsWrapper}>
                <div
                    className={styles.statsValue}
                    style={{ width: `${relativeSkillScore * 100}%`, background: bgColor }}
                >
                    <span>{skillValue.toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
};

const Menu = (props: MenuProps<any>) => {
    const sortBy = useAtom(sortByAtom);
    const allSkills = ['meanSkillScore', ...data[0].allSkills.keys()] as Array<keyof DataEntry>;

    const sortBySkill = (skill: keyof DataEntry) => () => {
        sortByAtom.set(skill);
    };

    return (
        <div className={styles.menu} ref={props.innerRef} {...props.innerProps}>
            <div className={cn(styles.sortWrapper, 'hide-scrollbar')}>
                {allSkills.map((skill) => (
                    <button
                        className={cn(styles.sortButton, { [styles.active]: sortBy === skill })}
                        onClick={sortBySkill(skill)}
                    >
                        {(computed.skillLabels as any)[skill]}
                    </button>
                ))}
            </div>
            {props.children}
        </div>
    );
};

export interface DataSelectionProps {
    value: number[];
    onChange: (value: number[]) => void;
}

const DataSelection = ({ value, onChange }: DataSelectionProps) => {
    const sortBy = useAtom(sortByAtom);

    const options = useMemo(() => {
        return [...data]
            .map((e, i) => ({ value: i, label: e.alias, data: e }))
            .sort((a, b) => (a.data[sortBy] as number) - (b.data[sortBy] as number));
    }, [sortBy]);

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
                components={{ DropdownIndicator, IndicatorSeparator: null, Option, Menu }}
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
