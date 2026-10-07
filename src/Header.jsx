 import "./style/App.css"
 import "./style/Header.css";
 import logo from "./assets/fidgetlogo.jpeg"
 import cartIcon from "./assets/shopping-cart.svg";
 import { useContext } from 'react'
 import { CartContext } from './context/Cart'
 
  function Header() {
    const { cart } = useContext(CartContext)
    return (
      <header>
      <div className="header-container">
        <p className="brand">FIDGET MAHALL</p>
    

        <div className="links">
            <p>Shop</p>
            <p>Features</p>
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
