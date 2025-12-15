import React from 'react'
import TransactionsImg from '../../assets/transactionsImg.svg'

function NoTransactions() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                flexDirection: "column",
                marginBottom: "2rem"
            }}
        >
            <img src={TransactionsImg} style={{ width: "400px,", margin: "4rem" }} alt='transactionChart' />
            <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                You Have No Transactions Currently
            </p>
        </div>
    )
}

export default NoTransactions