import React, { useEffect, useRef } from 'react';
import { Column } from '@antv/g2plot';

const BarChart = ({ title, data }) => {
    const chartContainerRef = useRef(null);
    
    useEffect(() => {
        if (chartContainerRef.current) {
            const columnPlot = new Column(chartContainerRef.current, {
                data,
                xField: "title",
                yField: "count",
                color: '#FF8800',
                label: {
                    position: 'middle',
                    style: {
                        fill: '#FFFFFF',
                        opacity: 0.6,
                    },
                },
                xAxis: {
                    label: {
                        autoHide: true,
                        autoRotate: false,
                    },
                },
            });

            columnPlot.render();

            return () => {
                columnPlot.destroy();
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

export default BarChart;
