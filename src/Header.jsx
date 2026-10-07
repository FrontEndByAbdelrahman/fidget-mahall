 import "./style/App.css"
 import "./style/Header.css";
 import logo from "./assets/fidgetlogo.jpeg"
 import cartIcon from "./assets/shopping-cart.svg";
 import { useContext } from 'react'
 import { CartContext } from './context/Cart'
import { Link, useNavigate } from 'react-router-dom'

  function Header() {
    const { cart } = useContext(CartContext)
    const navigate = useNavigate()

    const handleBrandClick = () => {
      window.scrollTo(0, 0)
      navigate('/')
    }

    const handleShopClick = () => {
      if (window.location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById('products')
          if (element) element.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      } else {
        const element = document.getElementById('products')
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const handleFeaturesClick = () => {
      if (window.location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById('features')
          if (element) element.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      } else {
        const element = document.getElementById('features')
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    return (
      <header>
      <div className="header-container">
        <p className="brand" onClick={handleBrandClick}>FIDGET MAHALL</p>


        <div className="links">
            <p onClick={handleShopClick}>Shop</p>
            <p onClick={handleFeaturesClick}>Features</p>
        </div>
        <div className="cart-container">
         <p className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</p>
        <img className="cart-icon"  src={cartIcon} alt="cart" />
    
        </div>
      </div>

      </header>
    );
  }

  export default Header;
