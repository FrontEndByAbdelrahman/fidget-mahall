import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CartContext } from './context/Cart'
import { getProductById } from './lib/supabase'
import './style/ProductDetail.css'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { cart, setCart } = useContext(CartContext)
    const [request, setRequest] = useState({
        id: null,
        product: null,
        error: null,
    })

    useEffect(() => {
        let isMounted = true

        window.scrollTo(0, 0)

        getProductById(id)
            .then(({ data, error: requestError }) => {
                if (!isMounted) return

                if (requestError) {
                    setRequest({ id, product: null, error: requestError.message })
                    return
                }

                setRequest({ id, product: data, error: null })
            })
            .catch((requestError) => {
                if (!isMounted) return

                console.error('Supabase product request failed:', requestError)
                setRequest({ id, product: null, error: requestError.message })
            })

        return () => {
            isMounted = false
        }
    }, [id])

    const loading = request.id !== id
    const error = loading ? null : request.error
    const product = loading ? null : request.product

    const addToCart = () => {
        const existingProduct = cart.find((item) => item.id === product.id)

        if (existingProduct) {
            setCart(cart.map((item) => (
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )))
            return
        }

        setCart([...cart, { ...product, quantity: 1 }])
    }

    if (loading) {
        return (
            <div className="product-detail-page">
                <p className="product-detail-status">Loading product...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="product-detail-page">
                <p className="product-detail-status product-detail-error">
                    Could not load product: {error}
                </p>
                <button className="back-btn" onClick={() => navigate('/')}>Back to Products</button>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-modal">
                    <h1>Product not found</h1>
                    <button className="back-btn" onClick={() => navigate('/')}>Back to Products</button>
                </div>
            </div>
        )
    }

    return (
        <div className="product-detail-page">
            <button className="back-btn" onClick={() => navigate('/')}>
                <span aria-hidden="true">←</span> Back to Products
            </button>

            <div className="product-detail-content">
                <div className="product-image-section">
                    {product.image && <img src={product.image} alt={product.name} />}
                    <span className="product-image-caption">FIDGET MAHALL <span>•</span> MADE TO PLAY</span>
                </div>

                <div className="product-info-section">
                    <span className="product-detail-eyebrow">A LITTLE JOY, EVERY DAY</span>
                    <h1>{product.name}</h1>
                    <p className="detail-description">{product.description}</p>
                    <p className="detail-price">
                        <span>{product.price}</span> <small>EGP</small>
                    </p>

                    <div className="detail-actions">
                        <button className="add-to-cart-btn" onClick={addToCart}>
                            <span aria-hidden="true">＋</span> Add to Cart
                        </button>
                        <button className="buy-now-btn" onClick={addToCart}>Buy Now <span aria-hidden="true">↗</span></button>
                    </div>

                    <div className="product-detail-divider" />
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
    )
}
