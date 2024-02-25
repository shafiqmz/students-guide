import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Pie, measureTextWidth } from '@antv/g2plot';

function renderStatistic(containerWidth, text, style) {
    const textWidth = measureTextWidth(text, style);
    const textHeight = style.lineHeight || style.fontSize;
    const R = containerWidth / 2;
    let scale = 0.5;
    if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
    }
    const textStyle = { ...style, width: `${containerWidth}px`, fontSize: `14px`, lineHeight: scale < 1 ? 1 : 'inherit' };
    return <div style={textStyle}>{text}</div>;
}

const Doughnut = ({ apiUrl, title, data }) => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            const piePlot = new Pie(chartContainerRef.current, {
                appendPadding: 10,
                data,
                angleField: 'value',
                colorField: 'type',
                color: [
                    '#0077CC',
                    '#ff8800'
                ],
                radius: 1,
                innerRadius: 0.64,
                meta: {
                    value: {
                        formatter: (v) => `${v}`,
                    },
                },
                label: {
                    type: 'outer',
                    offset: '-50%',
                    style: {
                        textAlign: 'center',
                    },
                    autoRotate: false,
                    content: '{percentage}',
                },
                statistic: {
                    title: {
                        offsetY: -4,
                        customHtml: (container, view, datum) => {
                            const { width, height } = container.getBoundingClientRect();
                            const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                            const text = datum ? datum.type : 'Total';
                            return ReactDOMServer.renderToString(renderStatistic(d, text, { fontSize: 14 }));
                        },
                    },
                    content: {
                        offsetY: 4,
                        style: {
                            fontSize: '32px',
                        },
                        customHtml: (container, view, datum, data) => {
                            const { width } = container.getBoundingClientRect();

                            const text = datum ? `${datum.value}` : `${data.reduce((r, d) => r + d.value, 0)}`;
                            return ReactDOMServer.renderToString(renderStatistic(width, text, { fontSize: 14 }));
                        },
                    },
                },
                legend: {
                    position: 'bottom',
                },
                interactions: [
                    { type: 'element-selected' },
                    { type: 'element-active' },
                    { type: 'pie-statistic-active' },
                ],
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
    )
};

export default Doughnut;