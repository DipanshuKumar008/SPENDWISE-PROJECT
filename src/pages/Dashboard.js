import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import DashboardCard from "../components/Cards";

import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import TransactionsTable from '../components/TransationsTable'

// import moment from "moment";
import { toast } from "react-toastify";

import { addDoc, collection, getDocs, query, deleteDoc } from "firebase/firestore";

import { db, auth } from "../firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import ChartsComponents from "../components/Charts";
import NoTransactions from "../components/NoTransactions";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";






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
    const [user, authLoading] = useAuthState(auth);

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


    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/"); 
        }
    }, [user, authLoading, navigate]);




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


    useEffect(() => {
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
    }, [transactions]);




    async function addTransaction(transaction, many) {
        if (!user) return;

        try {
            await addDoc(
                collection(db, `users/${user.uid}/transactions`),
                transaction
            );

            if (!many) toast.success("Transaction Added!");
            setTransactions((prev) => [...prev, transaction]);
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
        if (!user) return;

        setLoading(true);
        try {
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);

            const transactionsArray = querySnapshot.docs.map((doc) => doc.data());
            setTransactions(transactionsArray);
        } catch (e) {
            toast.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    }



    const resetBalance = async () => {
        if (!user) {
            toast.error("User not logged in");
            return;
        }

        try {
            setLoading(true);


            const q = query(collection(db, `users/${user.uid}/transactions`));
            const snapshot = await getDocs(q);

            const deletePromises = snapshot.docs.map((docItem) =>
                deleteDoc(docItem.ref)
            );

            await Promise.all(deletePromises);


            setTransactions([]);
            setIncome(0);
            setExpenses(0);
            setTotalBalance(0);

            toast.success("Balance reset successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reset balance");
        } finally {
            setLoading(false);
        }
    };







    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );





    return (
        <div>
            <Header />
            {loading ? (
                <div style={{
                    height: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <DashboardCard
                        income={income}
                        expenses={expenses}
                        totalBalance={totalBalance}
                        showExpenseModal={showExpenseModal}
                        showIncomeModal={showIncomeModal}
                        resetBalance={resetBalance}
                    />

                    {transactions.length !== 0 ? (
                        <ChartsComponents sortedTransactions={sortedTransactions} />
                    ) : (
                        <NoTransactions />
                    )}

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