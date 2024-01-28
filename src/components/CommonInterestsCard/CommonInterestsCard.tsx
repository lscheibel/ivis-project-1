import React, { useState } from 'react';
import { DataEntry } from '../../assets/data';
import { getKeywords } from '../../utils/word-buckets';
import D3, { D3BuilderArgs } from '../D3';
import * as d3 from 'd3';
import DashboardCard from '../DashboardCard/DashboardCard';
import styles from './CommonInterestsCard.module.scss';

export interface CommonInterestsCardProps {
    data: DataEntry[];
}

type DataProps = 'interests' | 'futureOutlook' | 'learnings';
const CommonInterestsCard = ({ data }: CommonInterestsCardProps) => {
    const [filter, setFilter] = useState<Array<DataProps>>(['interests', 'futureOutlook']);

    const bucket: Record<string, DataEntry[]> = {};
    data.forEach((d) => {
        const words = getKeywords(filter.map((c) => d[c]).join(' '));
        words.forEach((word) => {
            bucket[word] ??= [];
            bucket[word].push(d);
        });
    });

    const onToggle = (category: DataProps) => (e: any) => {
        if (e.target.checked) setFilter([...filter, category]);
        else setFilter(filter.filter((c) => c !== category));
    };

    return (
        <DashboardCard
            title={'Common Interests'}
            help={
                <>
                    <p>Indicates how many group members mention a keyword in one of their qualitative answers.</p>
                    <p>You may select which answers to include in the evaluation.</p>
                </>
            }
            className={styles.card}
            style={{ gridArea: 'interests' }}
        >
            <div className={styles.chartFilter}>
                <label>
                    interests{' '}
                    <input type={'checkbox'} checked={filter.includes('interests')} onChange={onToggle('interests')} />
                </label>
                <label>
                    future outlook{' '}
                    <input
                        type={'checkbox'}
                        checked={filter.includes('futureOutlook')}
                        onChange={onToggle('futureOutlook')}
                    />
                </label>
                <label>
                    learnings{' '}
                    <input type={'checkbox'} checked={filter.includes('learnings')} onChange={onToggle('learnings')} />
                </label>
            </div>
            <div className={styles.chartWrapper}>
                {filter.length === 0 ? (
                    'no data.'
                ) : (
                    <D3
                        data={bucket}
                        fn={interestsBubbleChart}
                        style={{
                            width: 'calc(100% + 120px + 40px)',
                            height: 'calc(100% + 100px + 0px)',
                            position: 'absolute',
                            left: '-120px',
                            bottom: '-100px',
                        }}
                    />
                )}
            </div>
        </DashboardCard>
    );
};

export default CommonInterestsCard;

const interestsBubbleChart = ({ data, width, height }: D3BuilderArgs<Record<string, DataEntry[]>>) => {
    const margin = 1; // to avoid clipping the root circle stroke

    const dataArray = Object.entries(data)
        .map(([word, entries]) => ({ word, value: entries.length, entries }))
        .sort((a, b) => b.value - a.value)
        // .filter((d) => d.value > 1)
        .slice(0, 10);

    const maxValue = dataArray.reduce((acc, curr) => Math.max(acc, curr.value), 0);

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

    const getColor = (value: number) => {
        const index = Math.floor((value / maxValue) * colors.length - 1);
        return colors[index];
    };

    // Create the pack layout.
    const pack = d3
        .pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(10);

    // Compute the hierarchy from the (flat) data; expose the values
    // for each node; lastly apply the pack layout.
    const root = pack(d3.hierarchy({ children: dataArray }).sum((d: any) => d.value * d.value) as any);

    // Create the SVG container.
    const svg = d3
        .create('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [-margin, -margin, width, height])
        .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;')
        .attr('text-anchor', 'middle');

    // Place each (leaf) node according to the layout’s x and y values.
    const node = svg
        .append('g')
        .selectAll()
        .data(root.leaves())
        .join('g')
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // Add a title.
    node.append('title').text((d) => (d.data as any).entries.map((e: DataEntry) => e.alias).join(', '));

    // Add a filled circle.
    node.append('circle')
        .attr('fill-opacity', 1)
        .attr('fill', (d: any) => getColor(d.data.value))
        .attr('r', (d) => Math.abs(d.r));

    // Add a label.
    const text = node.append('text').attr('clip-path', (d) => `circle(${d.r})`);

    // Add a tspan for the node’s value.
    text.append('tspan')
        .attr('x', 0)
        .attr('y', '0.17em')
        .attr('font-family', 'Syne, sans-serif')
        .attr('font-weight', (d) => `900`)
        .attr('font-size', (d) => `${d.r / 8}em`)
        .attr('fill', 'rgb(255, 255, 255)')
        .attr('fill-opacity', 0.2)
        .text((d: any) => `${d.data.value}`);

    // Add a tspan for each CamelCase-separated word.
    text.append('tspan')
        .attr('class', 'word')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-family', 'Syne, sans-serif')
        .attr('font-weight', 'normal')
        .attr('font-size', (d) => `${d.r / 4}px`)
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'rgb(255, 255, 255)')
        .text((d: any) => d.data.word);

    return svg.node();
};
