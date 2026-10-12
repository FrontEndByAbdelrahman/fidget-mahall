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
        <div className="footer-social">
          <a href="https://www.instagram.com/fidget_mahall?mdxt=ODlpeHp6cW9jN3o5" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@fidget_mahall?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
            </svg>
          </a>
        </div>
      </div>

    </footer>
  );
}