import React from 'react';
import { computed, DataEntry } from '../../assets/data';
import * as d3 from 'd3';
import SkillRadarChartAxisLabel from './SkillRadarChartAxisLabel';

export interface SkillRadarChartProps {
    data: DataEntry[];
    width: number;
    height: number;
}

const SkillRadarChart = ({ data: rawData, width, height }: SkillRadarChartProps) => {
    const margin = 32;

    const max = computed.maxSkillScore;

    if (rawData.length === 0) return null;

    const featureLabel = (feature: string) => {
        const labels = {
            skillInformationVisualization: 'Information Visualization',
            skillStatistics: 'Statistics',
            skillMathematics: 'Mathematics',
            skillComputerUsage: 'Computer Usage',
            skillProgramming: 'Programming',
            skillComputerGraphicsProgramming: 'CG Programming',
            skillHCIProgramming: 'HCI Programming',
            skillCodeRepository: 'Code Repository',
            skillCollaboration: 'Collaboration',
            skillCommunication: 'Communication',
            skillExperienceEvaluation: 'Experience Evaluation',
            skillArtistic: 'Artistic',
        };

        return labels[feature as keyof typeof labels];
    };

    const data = rawData.map((e) => Object.fromEntries(e.allSkills.entries()));
    const features = [...rawData[0].allSkills.keys()];

    const radialScale = d3
        .scaleLinear()
        .domain([0, max])
        .range([0, height / 2 - margin * 2]);

    const ticks = Array.from({ length: max }).map((_, i) => ({
        value: i + 1,
        color: `rgba(0,0,0,${(i + 1) % 5 === 0 ? 0.15 : 0.05})`,
    }));

    function angleToGlobalCoordinate(angle: number, value: number) {
        const x = Math.cos(angle) * radialScale(value);
        const y = Math.sin(angle) * radialScale(value);
        return { x: width / 2 + x, y: height / 2 - y };
    }

    function angleToLocalCoordinate(angle: number, value: number) {
        const x = Math.cos(angle) * radialScale(value);
        const y = Math.sin(angle) * radialScale(value);
        return { x: radialScale(max) + x, y: radialScale(max) - y };
    }

    const featureData = features.map((f, i) => {
        const angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
        return {
            name: f,
            label: featureLabel(f),
            angle: angle,
            topAngle: angle - Math.PI / 2,
            lineCoordinate: angleToGlobalCoordinate(angle, max),
            labelCoordinate: angleToGlobalCoordinate(angle, max + 1),
        };
    });

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

    // Plotting the Data

    function getGlobalPathCoordinates(data_point: Record<string, number>) {
        const coordinates = [];
        for (let i = 0; i < features.length; i++) {
            const ft_name = features[i];
            const angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
            coordinates.push(angleToGlobalCoordinate(angle, data_point[ft_name]));
        }
        return coordinates;
    }

    function getLocalPathCoordinates(data_point: Record<string, number>) {
        const coordinates = [];
        for (let i = 0; i < features.length; i++) {
            const ft_name = features[i];
            const angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
            coordinates.push(angleToLocalCoordinate(angle, data_point[ft_name]));
        }
        return coordinates;
    }

    const line = d3
        .line()
        .x((d: any) => d.x)
        .y((d: any) => d.y)
        .curve(d3.curveLinearClosed);

    const maxData: Record<string, number> = {};
    data.forEach((d) =>
        Object.entries(d).forEach(([key, value]) => {
            maxData[key] ??= value;
            maxData[key] = Math.max(maxData[key], value);
        })
    );

    // svg.selectAll('.data-stroke')
    //     .data(data)
    //     .join((enter) =>
    //         enter
    //             .insert('path')
    //             .datum((d) => getGlobalPathCoordinates(d) as any)
    //             .attr('d', line)
    //             .attr('class', 'data-stroke')
    //             .attr('stroke-opacity', '1')
    //             .attr('stroke-width', '1')
    //             .attr('stroke', '#111')
    //             // .attr('stroke', (_, i) => color(i))
    //             .attr('fill', 'none')
    //     );

    // svg.selectAll('.data-point')
    //     .data(data)
    //     .join((enter) =>
    //         enter
    //             .data((d) => getGlobalPathCoordinates(d))
    //             .append('circle')
    //             .attr('class', 'data-point')
    //             .attr('cx', (d) => d.x)
    //             .attr('cy', (d) => d.y)
    //             .attr('r', 3)
    //             .attr('fill', 'black')
    //     );

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0, 0, ${width}, ${height}`}
            style={{ maxWidth: '100%', height: 'auto' }}
        >
            <defs>
                <radialGradient id={'stepGradient'} cx={'50%'} cy={'50%'} r={'50%'}>
                    {colors
                        .flatMap((color, index, all) => {
                            const stepSize = 1 / all.length;
                            const stopA = { offset: `${index * stepSize * 100}%`, color };
                            const stopB = { offset: `${(index + 1) * stepSize * 100}%`, color };
                            return [stopA, stopB];
                        })
                        .map((stop, i) => (
                            <stop key={i} offset={stop.offset} stopColor={stop.color} />
                        ))}
                </radialGradient>
            </defs>
            {/*Tick Circles*/}
            {ticks.map((tick) => {
                return (
                    <circle
                        key={tick.value}
                        className={'tick-circles'}
                        cx={width / 2}
                        cy={height / 2}
                        fill={'none'}
                        strokeWidth={tick.value % 10 === 0 ? '3' : '1'}
                        stroke={'var(--black)'}
                        r={radialScale(tick.value)}
                    />
                );
            })}
            {/*Tick Numbers*/}
            {ticks.map((tick) => {
                return (
                    <text
                        key={tick.value}
                        className={'tickLabel'}
                        x={width / 2 + 3}
                        y={height / 2 - radialScale(tick.value) + 10}
                        dominantBaseline={'middle'}
                    >
                        {tick.value}
                    </text>
                );
            })}
            {/*Features Axis Lines*/}
            {featureData.map((feature) => {
                return (
                    <line
                        className={'axisLine'}
                        key={feature.name}
                        x1={width / 2}
                        y1={height / 2}
                        x2={feature.lineCoordinate.x}
                        y2={feature.lineCoordinate.y}
                        stroke={'var(--black)'}
                    />
                );
            })}
            {/*Features Axis Label*/}
            {featureData.map((feature) => {
                return (
                    <SkillRadarChartAxisLabel
                        key={feature.name}
                        className={'axisLabel'}
                        x={feature.labelCoordinate.x}
                        y={feature.labelCoordinate.y}
                        textAnchor={call(() => {
                            if (feature.topAngle % Math.PI === 0) return 'middle';
                            if (feature.topAngle > Math.PI) return 'start';
                            else return 'end';
                        })}
                        fill={'var(--white)'}
                        dominantBaseline={'middle'}
                        paddingX={8}
                        paddingY={0}
                        svgWidth={width}
                        svgHeight={height}
                    >
                        {feature.label}
                    </SkillRadarChartAxisLabel>
                );
            })}
            {/*Max Data Fill*/}
            {call(() => {
                const data = getLocalPathCoordinates(maxData);
                return (
                    <circle
                        cx={width / 2}
                        cy={height / 2}
                        r={radialScale(max)}
                        clipPath={`path('${line(data as any)}')`}
                        fill={'url(#stepGradient)'}
                    />
                );
            })}
            {/*Max Data Stroke*/}
            {call(() => {
                const data = getGlobalPathCoordinates(maxData);
                return (
                    <path
                        className={'max-data-stroke'}
                        d={line(data as any) as string}
                        strokeWidth={3}
                        stroke={'var(--black)'}
                        fill={'none'}
                    />
                );
            })}
            {/*Data Points*/}
            {/*{data.flatMap((d, outerIndex) => {*/}
            {/*    const positions = getGlobalPathCoordinates(d);*/}
            {/*    return positions.map((p, i) => {*/}
            {/*        return (*/}
            {/*            <circle*/}
            {/*                key={`${outerIndex}:${i}`}*/}
            {/*                cx={p.x}*/}
            {/*                cy={p.y}*/}
            {/*                r={1.5}*/}
            {/*                fill={'var(--black)'}*/}
            {/*                fillOpacity={0.3}*/}
            {/*            />*/}
            {/*        );*/}
            {/*    });*/}
            {/*})}*/}
        </svg>
    );
};

export default SkillRadarChart;

// eslint-disable-next-line @typescript-eslint/ban-types
const call = <F extends Function>(fn: F) => fn();
