import { useParams, useNavigate } from 'react-router-dom'
import keyboardFidget from "./assets/keyboardFidget.jpeg"
import "./style/ProductDetail.css";
 import { useContext } from 'react'
 import { CartContext } from './context/Cart'
 import { useEffect } from 'react'
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext)

  const products = [
    {
      id: 1,
      name: "Keyboard Fidget",
      description: "A keyboard fidget is a type of fidget toy that is designed to be used with a computer keyboard. It is typically a small handheld device that helps keep your hands busy while working.",
      image: keyboardFidget,
      price: "$24.99",
      badge: "NEW"
    },
    {
      id: 2,
      name: "Spin Fidget",
      description: "A smooth spinning fidget toy perfect for stress relief and focus. Features premium bearings for silent operation and long-lasting performance.",
      image: keyboardFidget,
      price: "$19.99",
      badge: "POPULAR"
    },
    {
      id: 3,
      name: "Click Fidget",
      description: "Satisfying clicking mechanism that provides tactile feedback. Great for anxiety relief and concentration during work or study sessions.",
      image: keyboardFidget,
      price: "$14.99",
      badge: null
    },
    {
      id: 4,
      name: "Stress Ball",
      description: "Premium quality stress ball with ergonomic design. Helps relieve tension and improve hand strength with daily use.",
      image: keyboardFidget,
      price: "$12.99",
      badge: "SALE"
    }
  ];

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-detail-overlay">
        <div className="product-detail-modal">
          <h1>Product not found</h1>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Products</button>
      
      <div className="product-detail-content">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info-section">
          {product.badge && <span className="detail-badge">{product.badge}</span>}
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <p className="detail-price">{product.price}</p>
          
          <div className="detail-actions">
            <button className="add-to-cart-btn"  onClick={()=>{
                            
                                  if(!cart.some(item => item.id === product.id)){
                                    setCart([...cart, { ...product, quantity: 1 }])
                                  } else {
                                    setCart(cart.map(item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item))
                                  }
                                }}>Add to Cart</button>
            <button className="buy-now-btn">Buy Now</button>
          </div>
          
          <div className="detail-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Premium Quality</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Fast Delivery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
