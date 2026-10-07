  import "./style/CheckOut.css";

  import { useContext } from 'react'
 import { CartContext } from './context/Cart'
   function CheckOut(){
    const { cart, setCart } = useContext(CartContext)
    return (
      <div className="checkout-page">
          <h1>CheckOut</h1>
      <div className="checkout-container">
      <div className="checkout-left">
   <p>Shopping Cart</p>
   <div>
    {cart.map((item) => (
      <div key={item.id}>
        <img src={item.image} alt={item.name} />
        <h2>{item.name}</h2>
        <p>{item.price}</p>
      </div>
    ))}

    <p>Order Summary</p>
  <div className="order-summary">
  <p className="total">
    Total:
    {cart.reduce((total, item) => total + item.price, 0)} EGP
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