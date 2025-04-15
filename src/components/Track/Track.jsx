import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './Track.module.css';
import supabase from '../../supabaseClient';

const OrderTracking = () => {
  const { theme } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Şifarişlər statusları - birbaşa Azərbaycan dilində
  const orderStatuses = [
    { id: 0, name: 'Gözləmədə', color: 'blue' },
    { id: 1, name: 'Hazırlanır', color: 'yellow' },
    { id: 2, name: 'Göndərilib', color: 'purple' },
    { id: 3, name: 'Çatdırılıb', color: 'green' },
    { id: 4, name: 'Ləğv edilib', color: 'red' }
  ];

  useEffect(() => {
    // Set document title
    document.title = 'Sifarişlərim';
    
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Istifadəçinin ID-ni al
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('İstifadəçi daxil olmayıb');
        }

        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            total_amount,
            status,
            created_at,
            estimated_delivery,
            order_items (
              id,
              product_id,
              quantity,
              price,
              products (
                id,
                name,
                image_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        
        if (!data || data.length === 0) {
          const sampleOrder = generateSampleOrder();
          setOrders([sampleOrder]);
        } else {
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      
        const sampleOrder = generateSampleOrder();
        setOrders([sampleOrder]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const generateSampleOrder = () => {
    const orderNumber = sessionStorage.getItem('orderNumber') || Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = new Date();
    const estimatedDelivery = new Date(createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    return {
      id: 1,
      order_number: orderNumber,
      total_amount: 1999.99,
      status: 1, // Processing
      created_at: createdAt.toISOString(),
      estimated_delivery: estimatedDelivery.toISOString(),
      order_items: [
        {
          id: 1,
          product_id: 1,
          quantity: 1,
          price: 20000,
          products: {
            id: 1,
            name: 'Rolex Submariner',
            image_url: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/submarine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvc3VibWFyaW5lLnBuZyIsImlhdCI6MTc0NDY5NTM4MSwiZXhwIjoxNzc2MjMxMzgxfQ.MRS7iZtdoA1s7k0Qt6mPaVq5g9C77VeFCaShvW-fsOY'
          }
        }],
        id: 2,
      order_number: orderNumber,
      total_amount: 40000,
      status: 2, 
      created_at: createdAt.toISOString(),
      estimated_delivery: estimatedDelivery.toISOString(),
      order_items: [ {
          id: 2,
          product_id: 2,
          quantity: 2,
          price: 30000,
          products: {
            id: 2,
            name: 'Rolex Datejust',
            image_url: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/submarine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvc3VibWFyaW5lLnBuZyIsImlhdCI6MTc0NDY5NTM4MSwiZXhwIjoxNzc2MjMxMzgxfQ.MRS7iZtdoA1s7k0Qt6mPaVq5g9C77VeFCaShvW-fsOY'
          }
        }
      
   ] };
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  
  const OrderStatusBadge = ({ status }) => {
    const statusInfo = orderStatuses.find(s => s.id === status) || orderStatuses[0];

    return (
      <span 
        className={`${styles.statusBadge} ${styles[`status${statusInfo.color}`]}`}
      >
        {statusInfo.name}
      </span>
    );
  };


  const OrderTimeline = ({ status }) => {
    return (
      <div className={styles.timeline}>
        {orderStatuses.slice(0, 4).map((statusItem, index) => (
          <div 
            key={statusItem.id} 
            className={`${styles.timelineItem} ${status >= statusItem.id ? styles.completed : ''}`}
          >
            <div className={styles.timelinePoint}></div>
            <div className={styles.timelineName}>{statusItem.name}</div>
          </div>
        ))}
      </div>
    );
  };

  const OrderDetails = ({ order }) => {
    if (!order) return null;

    return (
      <div className={`${styles.orderDetails} ${theme === 'dark' ? styles.orderDetailsDark : ''}`}>
        <h3 className={styles.orderDetailsTitle}>Sifariş Detalları</h3>
        
        <div className={styles.orderDetailHeader}>
          <div>
            <span className={styles.orderNumberLabel}>Sifariş №: </span>
            <span className={styles.orderNumber}>#{order.order_number}</span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className={styles.orderDates}>
          <div>
            <span className={styles.dateLabel}>Sifariş tarixi: </span>
            <span className={styles.dateValue}>{formatDate(order.created_at)}</span>
          </div>
          <div>
            <span className={styles.dateLabel}>Təxmini çatdırılma: </span>
            <span className={styles.dateValue}>{formatDate(order.estimated_delivery)}</span>
          </div>
        </div>

        <OrderTimeline status={order.status} />

        <div className={styles.orderItems}>
          <h4 className={styles.itemsTitle}>Məhsullar</h4>
          {order.order_items.map(item => (
            <div key={item.id} className={styles.orderItem}>
              <div className={styles.productImage}>
                <img 
                  src={item.products.image_url || '/images/placeholder.jpg'} 
                  alt={item.products.name} 
                />
              </div>
              <div className={styles.itemDetails}>
                <h5 className={styles.productName}>{item.products.name}</h5>
                <div className={styles.itemMeta}>
                  <span className={styles.itemQuantity}>Miqdar: {item.quantity}</span>
                  <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.orderTotal}>
          <span className={styles.totalLabel}>Ümumi məbləğ: </span>
          <span className={styles.totalValue}>${order.total_amount.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${theme === 'dark' ? styles.containerDark : ''}`}>
        <div className={styles.loading}>Yüklənir...</div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className={`${styles.container} ${theme === 'dark' ? styles.containerDark : ''}`}>
        <div className={styles.error}>Xəta yarandı: {error}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.containerDark : ''}`}>
      <h1 className={styles.pageTitle}>Sifarişlərim</h1>
      
      <div className={styles.contentWrapper}>
        <div className={`${styles.ordersList} ${theme === 'dark' ? styles.ordersListDark : ''}`}>
          <h2 className={styles.sectionTitle}>Son Sifarişlər</h2>
          
          {orders.length === 0 ? (
            <div className={styles.noOrders}>Hal-hazırda sifarişiniz yoxdur</div>
          ) : (
            <div className={styles.ordersContainer}>
              {orders.map(order => (
                <div 
                  key={order.id} 
                  className={`${styles.orderCard} ${selectedOrder === order.id ? styles.selectedOrder : ''} ${theme === 'dark' ? styles.orderCardDark : ''}`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <div className={styles.orderCardHeader}>
                    <span className={styles.orderCardNumber}>#{order.order_number}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  
                  <div className={styles.orderCardDate}>
                    {formatDate(order.created_at)}
                  </div>
                  
                  <div className={styles.orderCardItems}>
                    {order.order_items.slice(0, 2).map(item => (
                      <div key={item.id} className={styles.orderCardItem}>
                        <span className={styles.itemName}>{item.products.name}</span>
                        <span className={styles.itemQuantity}>x{item.quantity}</span>
                      </div>
                    ))}
                    {order.order_items.length > 2 && (
                      <div className={styles.moreItems}>
                        +{order.order_items.length - 2} daha çox məhsul
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.orderCardTotal}>
                    <span>Ümumi məbləğ:</span>
                    <span className={styles.totalAmount}>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedOrder && (
          <OrderDetails order={orders.find(order => order.id === selectedOrder)} />
        )}
      </div>
    </div>
  );
};

export default OrderTracking;