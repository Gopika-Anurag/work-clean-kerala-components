// MainTestimonialsSection.jsx
import React from 'react';
import TestimonialsCarousel from './TestimonialsCarousel';
import { carouselAttributes } from '../data/advancedtestimonialsData';

export default function MainTestimonialsSection() {
  const containerStyle = {
    backgroundColor: '#ffffff',
    color: '#1f2937',
    fontFamily: 'sans-serif',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '64px',   // 4rem = 64px
    paddingBottom: '64px',
    overflow: 'hidden'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '48px', // 3rem = 48px
    paddingLeft: '16px',  // 1rem = 16px
    paddingRight: '16px',
    maxWidth: '1280px',   // 80rem = 1280px
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const pStyle = {
    fontSize: '14px',      // 0.875rem = 14px
    fontWeight: '700',
    color: '#2563eb',
    letterSpacing: '0.2em',
    marginBottom: '16px',  // 1rem = 16px
  };

  const h1Style = {
    fontSize: '28px',      // 2.25rem = 36px
    fontWeight: '700',
    color: '#000000',
  };

  return (
    <section style={containerStyle}>
      {/* Header Section */}
      <header style={headerStyle}>
        <p style={pStyle}>USE CASES</p>
        <h1 style={h1Style}>
          Train, market and sell like a <br /> Fortune 100 company
        </h1>
      </header>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel attributes={carouselAttributes} useEditor={false} />
    </section>
  );
}
