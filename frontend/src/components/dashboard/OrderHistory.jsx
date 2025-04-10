import { useState, useEffect } from 'react';
import { useAuth } from '../../pages/Auth/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Network error when fetching orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && orders.length === 0 && !error) {
      setOrders([
        {
          id: 'ORD12345',
          date: '2023-10-15',
          status: 'Delivered',
          totalAmount: 134.97,
          items: [
            {
              id: '1',
              name: 'Brake Pads',
              quantity: 1,
              price: 59.99,
              image: 'https://via.placeholder.com/50'
            },
            {
              id: '2',
              name: 'Oil Filter',
              quantity: 2,
              price: 37.49,
              image: 'https://via.placeholder.com/50'
            }
          ]
        },
        {
          id: 'ORD12346',
          date: '2023-09-28',
          status: 'Shipped',
          totalAmount: 213.50,
          items: [
            {
              id: '3',
              name: 'Alternator',
              quantity: 1,
              price: 189.99,
              image: 'https://via.placeholder.com/50'
            },
            {
              id: '4',
              name: 'Wiper Blades',
              quantity: 1,
              price: 23.51,
              image: 'https://via.placeholder.com/50'
            }
          ]
        }
      ]);
    }
  }, [loading, orders, error]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div className="order-history">
      <div className="section-header">
        <h2>Order History</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-number">
                      Order #{order.id}
                    </div>
                    <div className="order-date">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item" key={item.id}>
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">${item.price.toFixed(2)} x {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="order-total">
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                  
                  <div className="order-actions">
                    <button className="btn-secondary">Track Order</button>
                    <button className="btn-secondary">View Invoice</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;