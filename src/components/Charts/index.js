import React from 'react'
import { Line, Pie } from "@ant-design/charts"
import { Transaction } from 'firebase/firestore';

function ChartsComponent({ sortedTransactions }) {
    const data = sortedTransactions.map((item) => {
        return { date: item.date, amount: item.amount }
    });

    const spendingData = sortedTransactions
        .filter(transaction => transaction.type === 'expense')
        .map(transaction => ({
            tag: transaction.tag,
            amount: transaction.amount,
        }));


    const finalspendings = Object.values(
        spendingData.reduce((acc, obj) => {
            if (!acc[obj.tag]) {
                acc[obj.tag] = { tag: obj.tag, amount: obj.amount };
            } else {
                acc[obj.tag].amount += obj.amount;
            }
            return acc;
        }, {})
    );


    const config = {
        data: data,
        xField: "date",
        yField: "amount",
    };
    const pieConfig = {
        data: finalspendings,
        angleField: "amount",
        colorField: "tag",
        radius: 0.9,
        label: {
            formatter: (datum) =>
                datum ? `${datum.tag} ₹${datum.amount}` : '',
        },
    };



    let chart;
    let pieChart;
    return (
        <div className='charts-wrapper'>

            <div>
                <h2>Your Analytics</h2>
                <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
            </div>
            <div>
                <h2>Your Spendings</h2>
                <Pie {...pieConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
            </div>
        </div>
    );
}

export default ChartsComponent
