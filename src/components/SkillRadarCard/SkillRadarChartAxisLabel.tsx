import React, { useEffect, useRef, useState } from 'react';

export interface SkillRadarChartAxisLabelProps extends React.SVGAttributes<SVGTextElement> {
    svgWidth: number;
    svgHeight: number;
    paddingX?: number;
    paddingY?: number;
}

const SkillRadarChartAxisLabel = ({
    paddingX = 0,
    paddingY = 0,
    svgWidth,
    svgHeight,
    ...props
}: SkillRadarChartAxisLabelProps) => {
    const ref = useRef<SVGTextElement | null>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);

    const bgX = !rect?.width ? -999 : rect.x - paddingX;
    const bgY = !rect?.height ? -999 : rect.y - paddingY;
    const bgWidth = !rect?.width ? 0 : rect.width + paddingX * 2;
    const bgHeight = !rect?.height ? 0 : rect.height + paddingY * 2;

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // For some reason the first few readouts are kinda wrong-ish? But I don't have time to fix this properly
        setTimeout(() => setRect(node.getBBox()), 10);
        setTimeout(() => setRect(node.getBBox()), 100);
        setTimeout(() => setRect(node.getBBox()), 500);
        setTimeout(() => setRect(node.getBBox()), 1000);
    }, [props.children, svgWidth, svgHeight]);

    return (
        <>
            {rect && (
                <rect
                    x={bgX}
                    y={bgY}
                    width={bgWidth}
                    height={bgHeight}
                    rx={bgHeight / 2}
                    fill={'var(--black)'}
                    stroke={'var(--off-white)'}
                    strokeWidth={2}
                />
            )}

            <text {...props} ref={ref}>
                {props.children}
            </text>
        </>
    );
};

export default SkillRadarChartAxisLabel;
