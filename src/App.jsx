import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartContext } from './context/Cart'
import { useContext } from 'react'
import '../src/style/App.css'
import Header from './Header'
import Hero from './Hero'
import ProductStory from './ProductStory'
import ProductsSec from './ProductsSec'
import Features from './Features'
import Footer from './Footer'
import ProductDetail from './ProductDetail'
import CheckOut from './CheckOut'

function App() {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart')
            if (!savedCart) return []

            const parsedCart = JSON.parse(savedCart)

            // Validate cart structure
            if (!Array.isArray(parsedCart)) return []

            return parsedCart.filter(item => (
                item &&
                typeof item === 'object' &&
                (typeof item.id === 'string' || typeof item.id === 'number') &&
                typeof item.quantity === 'number' &&
                item.quantity > 0 &&
                typeof item.price === 'number' &&
                item.price >= 0 &&
                typeof item.name === 'string' &&
                typeof item.image === 'string'
            ))
        } catch (error) {
            console.error('Failed to parse cart from localStorage:', error)
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    return (
        <CartContext.Provider value={{ cart, setCart }}>
        <>
            <Header />
            <Routes>
                <Route path="/" element={
                    <>
                        <Hero />
                        <ProductsSec />
                        <ProductStory />
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
