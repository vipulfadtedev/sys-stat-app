import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chartjs-adapter-moment';

const LineChart = () => {

    const [data, setData] = useState([] as any);
    const colorMap: { [index: string]: string } = {}
    const [colorStore, setColorStore] = useState(colorMap);

    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const getColor = (counter: string) => {
        let tempColorStore = colorStore;
        let color = tempColorStore[counter];
        if (!color) {
            color = getRandomColor();
            tempColorStore[counter] = color
            setColorStore(tempColorStore);
        }
        return color;
    }

    const epochToDate = (epoch: number) => {
        if (epoch < 10000000000)
            epoch *= 1000;
        epoch = epoch + (new Date().getTimezoneOffset() * -1);
        return new Date(epoch);
    }

    useEffect(() => {
        const run = () => {
            setData([]);
            axios.get(`http://10.0.0.7:5000/stats/in-last-hour`)
                .then((res: { data: any; }) => {
                    const status = res.data;

                    let statusData: any = {}
                    status.forEach((record: { counter: string; host: string; value: string; timestamp: number; }) => {
                        const counterName = record.counter;
                        let counter = statusData[counterName];
                        if (counter) {
                            if (counter[record.host]) {
                                counter[record.host].push({ x: epochToDate(record.timestamp), y: Number(record.value) });
                            } else {
                                counter[record.host] = [{ x: epochToDate(record.timestamp), y: Number(record.value) }];
                            }
                        } else {
                            statusData[record.counter] = {}
                            statusData[record.counter][record.host] = [{ x: epochToDate(record.timestamp), y: Number(record.value) }];
                        }
                    });

                    for (const counter in statusData) {
                        const datasets = [];

                        for (const key in statusData[counter]) {
                            datasets.push({
                                label: key,
                                data: statusData[counter][key],
                                backgroundColor: getColor(key),
                                borderColor: getColor(key)
                            });
                        }

                        const options = {
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        displayFormats: {
                                            second: 'DD-MM-YY hh:mm:ss'
                                        }
                                    }
                                }
                            }
                        }
                        setData([...data, { options, data: { datasets }, counter: counter.toUpperCase() }]);
                    }
                });
        }
        run()
        const interval = setInterval(() => run(), 60000)
        return () => {
            clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <ul>
            {
                data.map((value: any, index: string) => {
                    return <li style="position: relative;" key={index}>
                        <h5 key={value.counter}>{value.counter} Graph: </h5>
                        <div key={index}> <Line type='line' data={value.data} options={value.options} /></div>
                    </li>
                })
            }
            </ul>
        </div>
    );
};

export default LineChart;
