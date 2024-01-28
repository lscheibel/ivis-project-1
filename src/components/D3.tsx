import React, { useEffect, useRef } from 'react';
import { useStableCallback } from '../utils/useStableCallback';

export interface D3BuilderArgs<DataType> {
    data: DataType;
    width: number;
    height: number;
}

export interface D3Props<DataType> extends React.HTMLAttributes<HTMLDivElement> {
    data: DataType;
    fn: (args: D3BuilderArgs<DataType>) => SVGElement | null;
}

const D3 = <DataType,>({ fn, data, ...props }: D3Props<DataType>) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const execute = useStableCallback((data: DataType) => {
        const container = ref.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();

        const el = fn({ data, width: containerRect.width, height: containerRect.height });
        if (el) container.replaceChildren(el);
        else container.replaceChildren();
    });

    // Update graph when data changes.
    useEffect(() => execute(data), [data]);

    const handleResize = useStableCallback(() => {
        execute(data);
    });

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const observer = new ResizeObserver(handleResize);

        observer.observe(container);
        return () => observer.unobserve(container);
    }, [handleResize]);

    return <div {...props} style={{ display: 'flex', height: '100%', ...props.style }} ref={ref} />;
};

export default D3;
