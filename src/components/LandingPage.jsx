import React from 'react';
import '../assets/landingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/media/neurons.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="overlay"></div>
      <div className="modalLanding">
        <img src="/media/neurons-grey.png" width="89" alt="Logo" />
        <h1>Welcome to</h1>
        <h2><strong>code.neurons.me</strong></h2>
        <p>Start Developing</p>

        <div className="buttons">
          <a href="/repositories" className="btn">Source Code</a>
          <a href="https://neurons.me/" className="btn">Home</a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;