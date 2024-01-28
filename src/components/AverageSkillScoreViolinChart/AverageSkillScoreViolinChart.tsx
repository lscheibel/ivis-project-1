import React from 'react';
import { data as allData, DataEntry } from '../../assets/data';
import * as d3 from 'd3';
import { incrementalRound } from '../../utils/math';

export interface AverageSkillScoreViolinChartProps {
    skill?: string;
    data: DataEntry[];
    width: number;
    height: number;
}

const AverageSkillScoreViolinChart = ({
    skill = 'meanSkillScore',
    data,
    width: rawWidth,
    height: rawHeight,
}: AverageSkillScoreViolinChartProps) => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 1.5, bottom: 30, left: 1.5 };
    const width = rawWidth - margin.left - margin.right;
    const height = rawHeight - margin.top - margin.bottom;

    const getSkillValue = (dataEntry: DataEntry, skill: string) => {
        return (dataEntry as any)[skill];
    };

    const aggregatedData: Array<{ value: number; members: Array<{ value: number; entity: DataEntry }> }> = [];
    data.forEach((d) => {
        const rawValue = getSkillValue(d, skill);
        const value = incrementalRound(rawValue, 0.5);
        const existingEntry = aggregatedData.find((d) => d.value === value);

        if (!existingEntry) {
            aggregatedData.push({
                value,
                members: [{ value: rawValue, entity: d }],
            });
        } else {
            existingEntry.members.push({ value: rawValue, entity: d });
        }
    });

    let maxMeanScore = 0;
    const allSkillScores = new Map<number, number>();
    Array.from({ length: 10 + 1 }).forEach((_, i) => {
        allSkillScores.set(i, 0);
    });

    allData.forEach((d) => {
        const score = getSkillValue(d, skill);
        if (score > maxMeanScore) maxMeanScore = score;
        const key = Math.floor(score);
        allSkillScores.set(key, (allSkillScores.get(key) || 0) + 1);
    });

    // Read the data and compute summary statistics for each specie
    // Build and Show the Y scale
    const y = d3
        .scaleLinear()
        .domain([-maxMeanScore, maxMeanScore]) // Note that here the Y scale is set manually
        .range([0, height]);

    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    const x = d3.scaleLinear().range([0, width]).domain([0, 10]); // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.

    const area = d3
        .area()
        .y0((d) => y(-d[1]))
        .y1((d) => y(d[1]))
        .x((d) => x(d[0]))
        .curve(d3.curveCatmullRom);

    const areaPath = area([...allSkillScores.entries()].sort((a, b) => a[0] - b[0]))!;

    const whiskerSize = 24;

    return (
        <svg
            width={rawWidth}
            height={rawHeight}
            viewBox={`0, 0, ${rawWidth}, ${rawHeight}`}
            style={{ maxWidth: '100%', height: 'auto' }}
        >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <path d={areaPath} fill={'var(--off-white)'} />
            </g>
            <g transform={`translate(${margin.left}, ${margin.top + height / 2})`}>
                {/*Vertically Centered*/}
                <line x1={x.range()[0]} y1={0} x2={x.range()[1]} y2={0} stroke={'var(--black)'} strokeWidth={3} />
                {aggregatedData.map((d) => {
                    return (
                        <React.Fragment key={d.value}>
                            <circle cy={0} cx={x(d.value)} fill={'var(--red)'} r={8}>
                                <title>{d.members.map((m) => m.entity.alias).join(', ')}</title>
                            </circle>
                            <text x={x(d.value)} y={24} fill={'var(--black)'} textAnchor={'middle'}>
                                {d.value.toFixed(1)}
                            </text>
                        </React.Fragment>
                    );
                })}
                <line
                    x1={x.range()[0]}
                    x2={x.range()[0]}
                    y1={-whiskerSize / 2}
                    y2={whiskerSize / 2}
                    stroke={'var(--black)'}
                    strokeWidth={3}
                />
                <text x={x.range()[0] - 1.5} y={24} fill={'var(--black)'} textAnchor={'start'}>
                    0
                </text>
                <line
                    x1={x.range()[1]}
                    x2={x.range()[1]}
                    y1={-whiskerSize / 2}
                    y2={whiskerSize / 2}
                    stroke={'var(--black)'}
                    strokeWidth={3}
                />
                <text x={x.range()[1] + 1.5} y={24} fill={'var(--black)'} textAnchor={'end'}>
                    10
                </text>
            </g>
        </svg>
    );
};

export default AverageSkillScoreViolinChart;
