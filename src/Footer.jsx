import "./style/Footer.css";
import useScrollReveal from './useScrollReveal'

export default function Footer() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <footer
      ref={ref}
      className={`footer section-reveal section-reveal--footer${isVisible ? ' is-visible' : ''}`}
    >
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Fidget Mahall. All rights reserved.</p>
        <p>Made with <span className="heart">❤</span>by<a href="https://abdelrahman.abdelrahman-js-dev.workers.dev/">Abdelrahman</a></p>
      </div>
     
    </footer>
  );
}