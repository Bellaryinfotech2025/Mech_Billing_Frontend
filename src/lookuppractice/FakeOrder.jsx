import React, { useState } from "react";
import axios from "axios";

const FakeOrder = () => {
    const [orderId, setOrderId] = useState(null);  // To store the order ID
    const [orderDetails, setOrderDetails] = useState(null);  // To store order details

    // Function to handle the order submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const orderData = {
            ordernumber: '12345',  // Sample order number
            businessUnit: 'Unit1',
            ordertype: 'Type1',
            ordercategory: 'Category1',
            startDate: '2025-04-22',
            endDate: '2025-04-23',
        };

        axios.post('http://localhost:9933/api/orders/createorder', orderData)
            .then(response => {
                const { orderid } = response.data;
                console.log('Order created with ID:', orderid);

                // Store the generated orderId
                setOrderId(orderid);
            })
            .catch(err => {
                console.error('Error submitting order:', err);
            });
    };

    // Function to fetch order details by order ID
    const fetchOrderDetails = () => {
        if (!orderId) return;

        axios.get(`http://localhost:9933/api/orders/getallorderdetails?orderid=${orderId}`)
            .then(response => {
                console.log('Order details:', response.data);
                setOrderDetails(response.data);
            })
            .catch(err => {
                console.error('Error fetching order details:', err);
            });
    };

    return (
        <div>
            <h2>Submit Order</h2>
            <form onSubmit={handleSubmit}>
                <button type="submit">Submit Order</button>
            </form>

            {orderId && (
                <div>
                    <h3>Order ID: {orderId}</h3>
                    <button onClick={fetchOrderDetails}>Fetch Order Details</button>
                </div>
            )}

            {orderDetails && (
                <div>
                    <h3>Order Details:</h3>
                    <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default FakeOrder;
