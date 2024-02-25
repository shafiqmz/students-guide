import React, { useEffect, useRef, useState } from 'react';
import { Pie } from '@antv/g2plot';

const PieChart = ({ title, data }) => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            const piePlot = new Pie(chartContainerRef.current, {
                appendPadding: 10,
                data,
                angleField: 'value',
                colorField: 'type',
                color: [
                    "#0077CC",
                    "#ff8800"
                ],
                radius: 1,
                label: {
                    type: 'inner',
                    labelHeight: 12,
                    color: "#fff",
                    content: '{value}',
                },
                legend: {
                    position: 'bottom',
                },
                interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
                autoRotate: true,
            });

            piePlot.render();

            piePlot.on('element:click', (evt) => {

            });

            return () => {
                piePlot.destroy();
            };
        }
    }, []);

    return (
        <div className='flex flex-col h-full'>
            <div className='text-center my-2 font-semibold'>{title}</div>
            <div className="h-3/4" ref={chartContainerRef}></div>
        </div>
    );
};

export default PieChart;