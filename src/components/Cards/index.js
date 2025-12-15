import './style.css'
import { Row, Card } from 'antd'
import Button from '../Button'

function DashboardCard({income,expenses,totalBalance,showExpenseModal,showIncomeModal}) {

    return (
        <Row className='my-row'>
            <Card className='my-card' title="Current Balance">
                <p>₹ {totalBalance}</p>
                <Button text="Reset Balance" blue={true} />
            </Card >
            <Card className='my-card' title="Total Income">
                <p>₹ {income}</p>
                <Button text="Add Income" blue={true} onClick={showIncomeModal} />
            </Card >
            <Card className='my-card' title="Total Expences">
                <p>₹ {expenses}</p>
                <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
            </Card >
            
        </Row >
    )
}

export default DashboardCard