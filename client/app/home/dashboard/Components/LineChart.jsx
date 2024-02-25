import React, { useEffect, useRef } from 'react';
import { Line } from '@antv/g2plot';

const LineChart = ({title, data}) => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            const linePlot = new Line(chartContainerRef.current, {
                data: data,
                xField: 'title',
                yField: 'count',
                color: '#0077CC',
                label: {},
                point: {
                    size: 5,
                    shape: 'diamond',
                    style: {
                        fill: 'white',
                        stroke: '#ff8800',
                        lineWidth: 2,
                    },
                },
                tooltip: { showMarkers: false },
                state: {
                    active: {
                        style: {
                            shadowBlur: 4,
                            stroke: '#000',
                            fill: 'red',
                        },
                    },
                },
                interactions: [{ type: 'marker-active' }],
            });

            linePlot.render();

            return () => {
                linePlot.destroy();
            };
        }
    }, []);

    return (
        <div className='flex flex-col h-full'>
            <div className='text-center my-2 font-semibold'>{title}</div>
            <div className='h-3/4' ref={chartContainerRef}></div>
        </div>
    );
};

export default LineChart;
