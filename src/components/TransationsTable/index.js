import React, { useRef, useState } from "react";
import { Input, Table, Select, Radio } from "antd";
import searchImg from '../../assets/searchImg.svg'
import { unparse, parse } from "papaparse";

import { toast } from "react-toastify";



// const { Search } = Input;
const { Option } = Select;


function TransactionsTable({ transactions, addTransaction, fetchTransactions }) {
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    const filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter)
    );

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });

    function exportCSV() {
        if (!sortedTransactions.length) {

            toast.error("No transactions to export");
            return;
        }

        const csv = unparse({
            fields: ["name", "type", "tag", "date", "amount"],
            data: sortedTransactions,
        });

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
    }

function importFromCsv(event) {
    event.preventDefault();

    const file = event.target.files[0];
    if (!file) return;

    parse(file, {
        header: true,
        complete: async function (results) {
            for (const transaction of results.data) {
                if (!transaction.name || !transaction.type || !transaction.amount) continue;

                await addTransaction(
                    {
                        ...transaction,
                        amount: Number(transaction.amount),
                    },
                    true
                );
            }

            toast.success("All Transactions Added");
            fetchTransactions();
            event.target.value = ""; // reset file input
        },
    });
}





    return (
        <div
            style={{
                width: "100%",
                padding: "0rem 2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div className="input-flex">
                    <img src={searchImg} width="16" alt="Search-img" />
                    <input
                        placeholder="Search by Name"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>
            </div>
            <div>
                <div className="my-table">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            marginBottom: "1rem",
                        }}
                    >
                        <h2>My Transactions</h2>

                        <Radio.Group
                            className="input-radio"
                            onChange={(e) => setSortKey(e.target.value)}
                            value={sortKey}
                        >
                            <Radio.Button value="">No Sort</Radio.Button>
                            <Radio.Button value="date">Sort by Date</Radio.Button>
                            <Radio.Button value="amount">Sort by Amount</Radio.Button>
                        </Radio.Group>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "1rem",
                                width: "400px",
                            }}
                        >
                            <button className="btn"
                                onClick={exportCSV}
                            >
                                Export to CSV
                            </button>
                            <label htmlFor="file-csv" className="btn btn-blue">
                                Import from CSV
                            </label>
                            <input
                                onChange={importFromCsv}
                                id="file-csv"
                                type="file"
                                accept=".csv"
                                required
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={sortedTransactions}
                    />


                </div>
            </div>
        </div>
    );
}

export default TransactionsTable