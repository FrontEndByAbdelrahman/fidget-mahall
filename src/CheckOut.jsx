  import "./style/CheckOut.css";

  import { useContext, useState } from 'react'
 import { CartContext } from './context/Cart'
 import { submitCheckout } from './lib/supabase'
   function CheckOut(){
    const { cart, setCart } = useContext(CartContext)
    const [submission, setSubmission] = useState({ status: 'idle', message: '' })
    const [requestId, setRequestId] = useState(() => crypto.randomUUID())

    const handleCustomerSubmit = async (event) => {
      event.preventDefault()
      if (cart.length === 0) {
        setSubmission({
          status: 'error',
          message: 'Your cart is empty. Add a product before submitting checkout.',
        })
        return
      }

      const form = event.currentTarget
      const formData = new FormData(form)
      const customer = {
        'full-name': formData.get('full-name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        'user-address': formData.get('user-address'),
      }

      setSubmission({ status: 'submitting', message: '' })

      try {
        const { error } = await submitCheckout(customer, cart, requestId)

        if (error) {
          const messageByCode = {
            '22023': 'Your cart or customer information is invalid. Review the form and cart, then try again.',
            '42P01': 'Supabase could not find the public.users table. Confirm the table name and schema.',
            '42703': 'A users column name does not match the form. Confirm the column names and refresh the Supabase API schema.',
            '23502': 'The users table requires another column that has no default value.',
            '23514': 'One of the submitted values did not pass the users table validation.',
            PGRST204: 'Supabase could not find a users column in its API schema. Refresh the schema cache and verify the column name.',
            PGRST205: 'Supabase could not find public.users in its API schema. Refresh the schema cache and verify the table name.',
            PGRST202: 'Supabase could not find the checkout function in its API schema. Run checkout_inventory_rpc.sql again and confirm it returns public.submit_checkout(jsonb,jsonb,uuid).',
          }
          setSubmission({
            status: 'error',
            message: error.code === '42501'
              ? `Supabase denied checkout: ${error.message} Run checkout_inventory_rpc.sql in this project's SQL Editor.`
              : error.message?.includes('Insufficient stock')
                ? 'One or more products no longer have enough stock. Update your cart and try again.'
              : messageByCode[error.code] ?? `${error.message} Please verify that checkout_inventory_rpc.sql was run against the project configured in this app.`,
          })
          return
        }

        form.reset()
        setCart([])
        setRequestId(crypto.randomUUID())
        setSubmission({
          status: 'success',
          message: 'Checkout submitted successfully. Inventory has been updated.',
        })
      } catch (error) {
        console.error('Customer information request failed:', error)
        setSubmission({
          status: 'error',
          message: `${error.message || 'A network error occurred.'} Check the Supabase URL and publishable key, then try again.`,
        })
      }
    }

    const handleQuantityChange = (id, newQuantity) => {
      if (newQuantity < 1) return;
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    };

    const handleRemoveItem = (id) => {
      setCart(cart.filter(item => item.id !== id));
    };

    function ShippingCost() {
      if (cart.length === 0) {return 0;}
      return 60;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = ShippingCost();
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

    <form className="customer-form" onSubmit={handleCustomerSubmit}>

        <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
                id="name"
                name="full-name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={120}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                autoComplete="tel"
                maxLength={40}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                maxLength={254}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
                id="address"
                name="user-address"
                placeholder="Enter your address"
                rows="3"
                autoComplete="street-address"
                maxLength={500}
                required
            ></textarea>
        </div>

        {submission.message && (
          <p className={`customer-form-message ${submission.status}`} role={submission.status === 'error' ? 'alert' : 'status'}>
            {submission.message}
          </p>
        )}

        <button type="submit" className="checkout-btn" disabled={submission.status === 'submitting'}>
            {submission.status === 'submitting' ? 'Saving...' : 'Continue to Order'}
        </button>

    </form>
</div>
      </div>
      </div>
    )
   }
   export default CheckOut