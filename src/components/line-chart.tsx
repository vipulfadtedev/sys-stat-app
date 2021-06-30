import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const LineChart = () => {

    const [data, setData] = useState({});
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

    useEffect(() => {
        const run = () => {
            axios.get(`http://10.0.0.7:5000/stats/in-last-hour`)
                .then(res => {
                    const status = res.data;
                    let myData: any = {}

                    status.forEach((record: { host: string; value: string; }) => {
                        if (myData[record.host]) {
                            myData[record.host].push(Number(record.value));
                        } else {
                            myData[record.host] = [Number(record.value)];
                        }
                    });

                    let maxLength = 0;
                    const datasets = [];
                    const labels = [];

                    for (const key in myData) {
                        myData[key] = myData[key].slice(Math.max(myData[key].length - 20, 0));
                        maxLength = myData[key].length > maxLength ? myData[key].length : maxLength;
                    }
                    
                    for(let i=1; i<=maxLength; i++){
                        labels.push(i);
                    } 

                    for (const key in myData) {
                        datasets.push({
                            label: key,
                            data: myData[key],
                            backgroundColor: getColor(key),
                            borderColor: getColor(key)
                        });
                    }

                    setData({
                        labels,
                        datasets
                    });
                });
        }
        run()
        const interval = setInterval(() => run(), 60000)
        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <div>
            <Line type='line' data={data} />
        </div>
    );
};

export default LineChart;
