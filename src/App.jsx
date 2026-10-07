import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartContext } from './context/Cart'
import { useContext } from 'react'
import '../src/style/App.css'
import Header from './Header'
import Hero from './Hero'
import ProductsSec from './ProductsSec'
import Features from './Features'
import Footer from './Footer'
import ProductDetail from './ProductDetail'
import CheckOut from './CheckOut'
import keyboardFidget from "./assets/keyboardFidget.jpeg";
function App() {
   const [cart, setCart] = useState([
    {
        id: 1,
        name: "Keyboard Fidget",
        description: "...",
        image: keyboardFidget,
        price: 24.99,
        badge: "NEW",
        quantity: 1
    },
    {
        id: 2,
        name: "Spin Fidget",
        description: "...",
        image: keyboardFidget,
        price: 19.9,
        badge: "POPULAR",
        quantity: 2
    }
]);
    return (
        <CartContext.Provider value={{ cart, setCart }}>
        <>
            <Header />
            <Routes>
                <Route path="/" element={
                    <>
                        <Hero />
                        <ProductsSec />
                        <Features />
                        <Footer />
                    </>
                } />
                <Route path="/product/:id" element={
                    <>
                        <ProductDetail />
                        <Footer />
                    </>
                } />
                <Route path="/checkout" element={
                    <>
                        <CheckOut />
                        <Footer />
                    </>
                } />
            </Routes>
        </>
        </CartContext.Provider>
    )
  
}

export default App
