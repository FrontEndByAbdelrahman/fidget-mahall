import { useState, useEffect } from 'react'
import "./style/Hero.css";
import image1 from "./assets/hero-background1.jpeg"
import image2 from "./assets/hero-background2.jpeg";
import image3 from "./assets/hero-background3.jpeg"

const images = [
  image1,
  image2,
  image3
]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length)
        setIsAnimating(false)
      }, 100)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const scrollToProducts = () => {
    const element = document.getElementById('products')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero">
      <div className="hero-bg-wrapper">
        {images.map((img, index) => (
          <div
            key={index}
            className={`hero-bg ${index === currentImage ? 'hero-bg-active' : ''}`}
            style={{ backgroundImage: `url("${img}")` }}
          />
        ))}
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <span className="hero-badge">NEW • KEYBOARD FIDGET</span>

        <h1>
          Your New Favorite
          <span> Fidget.</span>
        </h1>

        <p>
          A satisfying keyboard experience designed to keep your hands busy
          and your mind relaxed.
        </p>

        <div className="hero-actions">
          <button onClick={scrollToProducts} className="hero-btn">Shop Now</button>
        </div>
      </div>
    </section>
  );
}