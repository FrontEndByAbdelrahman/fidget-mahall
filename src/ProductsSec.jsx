import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from './context/Cart'
import { getProducts } from './lib/supabase'
import './style/ProductsSec.css'

export default function ProductsSec() {
    const navigate = useNavigate()
    const { cart, setCart } = useContext(CartContext)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isMounted = true

        getProducts()
            .then(({ data, error: requestError }) => {
                if (!isMounted) return

                if (requestError) {
                    setError(requestError.message)
                    return
                }

                setProducts(data ?? [])
                console.log('Products fetched from Supabase:', data)
                console.table(data ?? [])
            })
            .catch((requestError) => {
                if (!isMounted) return

                console.error('Supabase products request failed:', requestError)
                setError(requestError.message)
            })
            .finally(() => {
                if (isMounted) setLoading(false)
            })

        return () => {
            isMounted = false
        }
    }, [])

    const addToCart = (product) => {
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

    return (
        <section id="products" className="products-section">
            <div className="products-container">
                <span className="products-eyebrow">MADE FOR YOUR MOMENTS</span>
                <h2>Our Products</h2>
                <p className="subtitle">Discover our premium fidget toys designed for relaxation and focus</p>

                {loading && <p className="products-status">Loading products...</p>}
                {error && <p className="products-status products-error">Could not load products: {error}</p>}
                {!loading && !error && products.length === 0 && (
                    <p className="products-status">No products are available right now.</p>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="products-grid">
                        {products.map((product) => (
                            <div className="product-card" key={product.id}>
                                <div className="image-wrapper">
                                    {product.image && (
                                        <button
                                            className="product-image-button"
                                            type="button"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            aria-label={`View ${product.name}`}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                onError={(event) => console.error('Failed to load product image:', event.currentTarget.src)}
                                            />
                                        </button>
                                    )}
                                    <span className="image-hint">VIEW PRODUCT <span aria-hidden="true">↗</span></span>
                                </div>
                                <div className="product-card-content">
                                    <button
                                        className="product-name-button"
                                        type="button"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        <h3>{product.name}</h3>
                                        <span aria-hidden="true">↗</span>
                                    </button>
                                    <p>{product.description}</p>
                                </div>
                                <div className="card-footer">
                                    <span className="price">
                                        <small>PRICE</small>
                                        {product.price} <small>EGP</small>
                                    </span>
                                    <button type="button" onClick={() => addToCart(product)}>
                                        <span aria-hidden="true">＋</span> Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
