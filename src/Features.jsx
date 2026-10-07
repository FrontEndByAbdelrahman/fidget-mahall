import "./style/Features.css";

export default function Features() {
  const features = [
    {
      icon: "⚡",
      title: "Fast Delivery",
      description: "Get your order delivered quickly with our express shipping service."
    },
    {
      icon: "💰",
      title: "Cash on Delivery",
      description: "Pay when you receive your order. Convenient and secure."
    },
    {
      icon: "❤️",
      title: "Customer First",
      description: "Your satisfaction is our priority. Best shopping experience."
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <h2>Why Choose Us?</h2>
        <p className="subtitle">We provide the best fidget toys with exceptional service</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
