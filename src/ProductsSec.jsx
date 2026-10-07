import keyboardFidget  from "./assets/keyboardFidget.jpeg";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style/ProductsSec.css'
import { useContext } from 'react'
import { CartContext } from './context/Cart'
import { useEffect } from 'react'


export default function ProductsSec() {
    const navigate = useNavigate();
   const { cart, setCart } = useContext(CartContext)
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Keyboard Fidget",
            description: "A keyboard fidget is a type of fidget toy that is designed to be used with a computer keyboard. It is typically a small handheld device that helps keep your hands busy while working.",
            image: keyboardFidget,
            price: "$24.99",
            badge: "NEW",
        },
        {
            id: 2,
            name: "Spin Fidget",
            description: "A smooth spinning fidget toy perfect for stress relief and focus. Features premium bearings for silent operation and long-lasting performance.",
            image: keyboardFidget,
            price: "$19.99",
            badge: "POPULAR",
        },
        {
            id: 3,
            name: "Click Fidget",
            description: "Satisfying clicking mechanism that provides tactile feedback. Great for anxiety relief and concentration during work or study sessions.",
            image: keyboardFidget,
            price: "$14.99",
            badge: null,
        },
        {
            id: 4,
            name: "Stress Ball",
            description: "Premium quality stress ball with ergonomic design. Helps relieve tension and improve hand strength with daily use.",
            image: keyboardFidget,
            price: "$12.99",
            badge: "SALE",
        }
    ]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };
    
    useEffect(() => {
        console.log(cart);
    }, [cart]);
    
    return (

        <section id="products" className="products-section">
            <div className="products-container">
                <h2>Our Products</h2>
                <p className="subtitle">Discover our premium fidget toys designed for relaxation and focus</p>
                <div className="products-grid">
                    {products.map((product) => (
                        <div 
                            className="product-card" 
                            key={product.id}

                        >
                            <div className="image-wrapper">
                                {product.badge && <span className="badge">{product.badge}</span>}
                                <img   onClick={() => handleProductClick(product.id)} src={product.image} alt={product.name} />
                            </div>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <div className="card-footer">
                                <span className="price">{product.price}</span>
                                <button onClick={()=>{
                            
                                  if(!cart.some(item => item.id === product.id)){
                                    // add to cart
                                    setCart([...cart, { ...product, quantity: 1 }])
                                  } else {
                                    // update quantity
                                    setCart(cart.map(item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item))
                                  }
                                }} >Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}