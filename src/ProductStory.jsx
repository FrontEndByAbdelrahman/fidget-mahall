import './style/ProductStory.css'
import productVideo from './assets/b_Create_a_premium_15-.mp4'
import useScrollReveal from './useScrollReveal'

export default function ProductStory() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      ref={ref}
      className={`product-story section-reveal section-reveal--story${isVisible ? ' is-visible' : ''}`}
      aria-labelledby="product-story-title"
    >
      <div className="product-story-container">
        <div className="product-story-visual">
          <video
            className="product-story-video"
            src={productVideo}
            autoPlay
            muted
            playsInline
          />
          <div className="product-story-stamp" aria-hidden="true">
            <span>ONE</span>
            <strong>GOOD</strong>
            <span>CLICK</span>
          </div>
          <span className="product-story-caption">SMALL ENOUGH TO TAKE ANYWHERE</span>
        </div>

        <div className="product-story-copy">
          <span className="product-story-eyebrow">THE STORY BEHIND THE CLICK</span>
          <h2 id="product-story-title">
            A little click.
            <span> A moment for you.</span>
          </h2>
          <p>
            It started with a simple idea: bring the familiar feel of a keyboard
            into a pocket-sized fidget you can enjoy anywhere. A satisfying
            little press, a playful burst of color, and a tiny break whenever
            you need one.
          </p>
          <p>
            That is the spirit of Fidget Mahall: everyday objects made a little
            more fun, one click at a time.
          </p>
          <a className="product-story-link" href="#products">
            Meet your new favorite <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
