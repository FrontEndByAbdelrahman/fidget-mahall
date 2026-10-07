import "./style/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Fidget Mahall. All rights reserved.</p>
        <p>Made with <span className="heart">❤</span>by<a href="https://abdelrahman.abdelrahman-js-dev.workers.dev/">Abdelrahman</a></p>
      </div>
     
    </footer>
  );
}