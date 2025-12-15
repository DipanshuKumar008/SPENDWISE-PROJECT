import React from 'react'
import './style.css'
import { Button, Modal, Form, Input, Select, DatePicker } from 'antd'

function AddIncomeModal({
    isIncomeModalVisible,
    handleIncomeCancel,
    onFinish,
}) {
    const [form] = Form.useForm()

    return (
        <Modal
            title="Add Income"
            open={isIncomeModalVisible}
            onCancel={handleIncomeCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    onFinish(values, "income")
                    form.resetFields()
                }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter the income name",
                        },
                    ]}
                >
                    <Input className="custom-input" placeholder="e.g. Monthly Salary" />
                </Form.Item>

                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: "Please enter the income amount",
                        },
                    ]}
                >
                    <Input className="custom-input" type="number" placeholder="e.g. 25000" />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: "Please select the income date",
                        },
                    ]}
                >
                    <DatePicker
                        className="custom-input"
                        format="YYYY-MM-DD"
                        style={{ width: "100%"  }}
                    />
                </Form.Item>

                <Form.Item
                    label="Tag"
                    name="tag"
                    rules={[
                        {
                            required: true,
                            message: "Please select a tag",
                        },
                    ]}
                >
                    <Select className="select-input-2" placeholder="Select income type">
                        <Select.Option value="salary">Salary</Select.Option>
                        <Select.Option value="freelance">Freelance</Select.Option>
                        <Select.Option value="business">Business</Select.Option>
                        <Select.Option value="investment">Investment</Select.Option>
                        <Select.Option value="interest">Interest</Select.Option>
                        <Select.Option value="rental">Rental Income</Select.Option>
                        <Select.Option value="bonus">Bonus</Select.Option>
                        <Select.Option value="commission">Commission</Select.Option>
                        <Select.Option value="dividend">Dividend</Select.Option>
                        <Select.Option value="gift">Gift</Select.Option>
                        <Select.Option value="refund">Refund</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block className="btn btn-blue">
                        Add Income
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddIncomeModal
