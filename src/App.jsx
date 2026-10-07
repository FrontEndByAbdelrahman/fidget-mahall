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

function App() {
    const [cart, setCart] = useState([]);
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
            </Routes>
        </>
        </CartContext.Provider>
    )
  
}

export default App
