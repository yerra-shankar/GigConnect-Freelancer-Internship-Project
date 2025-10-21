// import React, { useState } from 'react';
// import { paymentAPI } from '../../services/api';
// import { useAppContext } from '../../context/AppContext';
// import { formatCurrency } from '../../utils/helpers';

// const PaymentButton = ({ amount, gigId, freelancerId, onSuccess, onError }) => {
//   const [loading, setLoading] = useState(false);
//   const { showAlert } = useAppContext();

//   const handlePayment = async () => {
//     setLoading(true);
    
//     try {
//       // Step 1: Create payment order
//       const orderResponse = await paymentAPI.createOrder({
//         amount,
//         gigId,
//         freelancerId
//       });

//       // Step 2: Initialize Razorpay (or Stripe)
//       // This is a mock implementation - replace with actual Razorpay/Stripe integration
//       const paymentResult = await simulatePayment(orderResponse.data);
      
//       if (paymentResult.success) {
//         // Step 3: Verify payment on backend
//         await paymentAPI.verifyPayment({
//           orderId: orderResponse.data.orderId,
//           paymentId: paymentResult.paymentId,
//           signature: paymentResult.signature
//         });
        
//         showAlert('Payment successful!', 'success');
//         onSuccess && onSuccess();
//       } else {
//         throw new Error('Payment failed');
//       }
//     } catch (error) {
//       showAlert(error.message || 'Payment failed. Please try again.', 'danger');
//       onError && onError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mock payment simulation - replace with actual payment gateway
//   const simulatePayment = (orderData) => {
//     return new Promise((resolve) => {
//       const confirmed = window.confirm(
//         `Confirm payment of ${formatCurrency(amount)}?\n\nOrder ID: ${orderData.orderId}`
//       );
      
//       setTimeout(() => {
//         resolve({
//           success: confirmed,
//           paymentId: confirmed ? `pay_${Date.now()}` : null,
//           signature: confirmed ? `sig_${Date.now()}` : null
//         });
//       }, 1000);
//     });
//   };

//   return (
//     <button
//       className="btn btn-success"
//       onClick={handlePayment}
//       disabled={loading}
//     >
//       {loading ? (
//         <>
//           <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//           Processing...
//         </>
//       ) : (
//         <>
//           <i className="fas fa-credit-card me-2"></i>
//           Pay {formatCurrency(amount)}
//         </>
//       )}
//     </button>
//   );
// };

// export default PaymentButton;


