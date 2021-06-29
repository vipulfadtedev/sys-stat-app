import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const LineChart = () => {
    const [data, setData] = useState({});


    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    useEffect(() => {
        const run = () => {
            axios.get(`http://10.0.0.7:5000/stats`)
                .then(res => {
                    console.log('Response ===>', res);
                    const status = res.data;
                    let myData: any = {}

                    status.forEach((record: { host: string; value: string; }) => {
                        if (myData[record.host]) {
                            myData[record.host].push(Number(record.value));
                        } else {
                            myData[record.host] = [Number(record.value)];
                        }
                    });
                    
                    for (const key in myData) {
                        myData[key] = myData[key].slice(Math.max(myData[key].length - 20, 0));
                    }
                    console.log('myData ===>', myData);
                    const datasets = [];
                    const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

                    for (const key in myData) {
                        datasets.push({
                            label: key,
                            data: myData[key],
                            backgroundColor: getRandomColor()
                        });
                    }
                    setData({
                        labels,
                        datasets
                    });
                });
        }
        run()
        const interval = setInterval(() => run(), 300000)
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
