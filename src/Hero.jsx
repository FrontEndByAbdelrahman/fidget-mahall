import "./style/Hero.css";
import logo from "./assets/fidgetlogo.jpeg"
export default function Hero() {
  return (
    <section className="hero">
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
          <button className="hero-btn">Shop NOW</button>
        </div>
      </div>

      <div className="logo-container">
        <div className="product-glow"></div>

        <img
          src={logo}
          alt="Fidget logo"
        />
      </div>
    </section>
  );
}