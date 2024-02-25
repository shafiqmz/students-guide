import React, { useEffect, useRef } from 'react';
import { Bar } from '@antv/g2plot';

const HorizontalBar = ({ title, data}) => {
    
    const chartContainerRef = useRef(null);

    const maxLikesEntry = data.reduce((max, entry) => (entry.likes > max.likes ? entry : max), { likes: -Infinity });

    useEffect(() => {
        if (chartContainerRef.current) {
            const barPlot = new Bar(chartContainerRef.current, {
                data,
                xField: 'count',
                yField: 'title',
                seriesField: 'name',
                color: ({ name }) => (name === maxLikesEntry.name ? '#0077CC' : '#ff8800'),
                legend: false,
                meta: {
                    name: {
                        alias: 'Name',
                    },
                    likes: {
                        alias: 'Likes',
                    },
                },
            });

            barPlot.render();

            return () => {
                barPlot.destroy(); 
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

export default HorizontalBar;
