  import "./style/CheckOut.css";

  import { useContext } from 'react'
 import { CartContext } from './context/Cart'
   function CheckOut(){
    const { cart, setCart } = useContext(CartContext)

    const handleQuantityChange = (id, newQuantity) => {
      if (newQuantity < 1) return;
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    };

    const handleRemoveItem = (id) => {
      setCart(cart.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 90;
    const orderTotal = subtotal + shipping;

    return (
      <div className="checkout-page">
          <h1>CheckOut</h1>
      <div className="checkout-container">
      <div className="checkout-left">
   <p className="cart-section-title">Shopping Cart</p>
   <div className="cart-items">
    {cart.map((item) => (
    <div className="co-item-card" key={item.id}>
      <div className="co-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="co-item-details">
        <div className="co-item-header">
          <h3 className="co-item-name">{item.name}</h3>
          <button
            type="button"
            className="co-item-delete"
            onClick={() => handleRemoveItem(item.id)}
          >
            ✕
          </button>
        </div>

        <p className="co-item-price">{item.price} EGP</p>

        <div className="co-item-footer">
          <div className="co-qty-wrapper">
            <button
              type="button"
              className="co-qty-btn"
              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            >
              −
            </button>
            <span className="co-qty-value">{item.quantity}</span>
            <button
              type="button"
              className="co-qty-btn"
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <p className="co-item-total">{item.price * item.quantity} EGP</p>
        </div>
      </div>
    </div>
    ))}

    <p className="order-summary-title">Order Summary</p>
  <div className="order-summary">
        <p className="subtotal">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">{subtotal.toFixed(2)} EGP</span>
        </p>
        <p className="shipping">
          <span className="summary-label">Shipping</span>
          <span className="summary-value">{shipping} EGP</span>
        </p>
        <p className="total">
          <span className="summary-label">Total</span>
          <span className="summary-value">{orderTotal.toFixed(2)} EGP</span>
        </p>
  </div>
   </div>

      </div>
    <div className="checkout-right">
    <p className="customer-title">Customer Information</p>

    <form className="customer-form">

        <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
                id="name"
                type="text"
                placeholder="Enter your full name"
            />
        </div>

        <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
            />
        </div>

        <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
                id="email"
                type="email"
                placeholder="Enter your email"
            />
        </div>

        <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
                id="address"
                placeholder="Enter your address"
                rows="3"
            ></textarea>
        </div>

        <button type="submit" className="checkout-btn">
            Continue to Order
        </button>

    </form>
</div>
      </div>
      </div>
    )
   }
   export default CheckOut