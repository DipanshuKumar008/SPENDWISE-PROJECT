import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import DashboardCard from "../components/Cards";

import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import TransactionsTable from '../components/TransationsTable'

// import moment from "moment";
import { toast } from "react-toastify";

import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db, auth } from "../firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import ChartsComponents from "../components/Charts";
import NoTransactions from "../components/NoTransactions";





function Dashboard() {

    // const sampleTransactions = [
    // {
    //   name: "Pay day",
    //   type: "income",
    //   date: "2023-01-15",
    //   amount: 2000,
    //   tag: "salary",
    // },
    // {
    //   name: "Dinner",
    //   type: "expense",
    //   date: "2023-01-20",
    //   amount: 500,
    //   tag: "food",
    // },
    // {
    //   name: "Books",
    //   type: "expense",
    //   date: "2023-01-25",
    //   amount: 300,
    //   tag: "education",
    // },
    // ];
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const [user] = useAuthState(auth)
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

    const [income, setIncome] = useState(0)
    const [expenses, setExpenses] = useState(0)
    const [totalBalance, setTotalBalance] = useState(0);


    const showExpenseModal = () => {
        setIsExpenseModalVisible(true);
    };

    const handleExpenseCancel = () => {
        setIsExpenseModalVisible(false);
    };



    const showIncomeModal = () => {
        setIsIncomeModalVisible(true);
    };

    const handleIncomeCancel = () => {
        setIsIncomeModalVisible(false);
    };


    const onFinish = (values, type) => {
        const newTransaction = {
            type: type,
            date: values.date.format('YYYY-MM-DD'),
            amount: parseFloat(values.amount),
            tag: values.tag,
            name: values.name,
        };
        addTransaction(newTransaction)
    }



const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
        if (transaction.type === "income") {
            incomeTotal += transaction.amount;
        }

        if (transaction.type === "expense") {
            expensesTotal += transaction.amount;
        }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
};



useEffect(() => calculateBalance(), [transactions]);



    async function addTransaction(transaction,many) {
    if (!user) return;

    try {
        const docRef = await addDoc(
            collection(db, `users/${user.uid}/transactions`),
            transaction
        );

        if (!many)toast.success("Transaction Added!");
        const newArr = transactions;
        newArr.push(transaction)
        setTransactions(newArr);
        calculateBalance();
    } catch (e) {
        console.error("Error adding document:", e);
        if (!many) toast.error("Couldn't add transaction");
    }
}



useEffect(() => {
    if (user) {
        fetchTransactions();
    }
}, [user]);



    async function fetchTransactions() {
        setLoading(true);
        if (user) {
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);
            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                //doc.data() is never undefined for query doc snapshots
                transactionsArray.push(doc.data());

            });
            setTransactions(transactionsArray)
            console.log('TransactionArr', transactionsArray)
            toast.success("Transactions Fetched!");
        }
        setLoading(false)
    }

    let sortedTransactions = transactions.sort((a,b)=>{
        return new Date (a.date) - new Date(b.date)
    }) 

    return (
        <div>
            <Header />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <DashboardCard
                        income={income}
                        expenses={expenses}
                        totalBalance={totalBalance}
                        showExpenseModal={showExpenseModal}
                        showIncomeModal={showIncomeModal}
                    />
                    {transactions.length!==0? < ChartsComponents sortedTransactions={sortedTransactions} /> :<NoTransactions/>}
                    <AddExpenseModal
                        isExpenseModalVisible={isExpenseModalVisible}
                        handleExpenseCancel={handleExpenseCancel}
                        onFinish={onFinish}
                    />

                    <AddIncomeModal
                        isIncomeModalVisible={isIncomeModalVisible}
                        handleIncomeCancel={handleIncomeCancel}
                        onFinish={onFinish}
                    />
                    <TransactionsTable 
                    transactions={transactions} 
                    addTransaction={addTransaction} 
                    fetchTransactions={fetchTransactions}
                    />
                </>
            )}
        </div>
    );
}

export default Dashboard