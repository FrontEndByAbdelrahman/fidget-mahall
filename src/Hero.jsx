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
  const [prevImage, setPrevImage] = useState(0)
  const [transition, setTransition] = useState(false)

  useEffect(()=>{
   const interval = setInterval(() => {
    setPrevImage(currentImage)
    setTransition(true)
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 100)
    setTimeout(() => {
      setTransition(false)
    }, 1100)
   }, 3000)
   return () => clearInterval(interval)
  },[currentImage])

  const scrollToProducts = () => {
    const element = document.getElementById('products')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero">
      <div
        className="hero-bg hero-bg-prev"
        style={{ backgroundImage: `url("${images[prevImage]}")`, opacity: transition ? 0 : 1 }}
      />
      <div
        className="hero-bg hero-bg-current"
        style={{ backgroundImage: `url("${images[currentImage]}")`, opacity: transition ? 1 : 0 }}
      />
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
          <button onClick={scrollToProducts} className="hero-btn">Shop NOW</button>
        </div>
      </div>
    </section>
  );
}