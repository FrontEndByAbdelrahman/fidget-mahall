import "./style/Features.css";

export default function Features() {
  const features = [
    {
      icon: "⚡",
      title: "Careful Order Handling",
      description: "Your order is delivered straight to your doorstep."
    },
    {
      icon: "💰",
      title: "Cash on Delivery",
      description: "Inspect your product when it arrives, then confirm receipt and pay with confidence."
    },
    {
      icon: "❤️",
      title: "A Customer-First Experience",
      description: "From choosing your fidget to receiving your order, we focus on making your experience enjoyable."
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-heading">
          <span className="features-eyebrow">THE FIDGET MAHALL PROMISE</span>
          <h2>A Better Way to Shop</h2>
          <p className="subtitle">Thoughtful products and a smooth experience from checkout through delivery.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-card-top">
                <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
                <span className="feature-number">0{index + 1}</span>
              </div>
              <div className="feature-copy">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div className="feature-card-line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
