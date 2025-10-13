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
    paddingTop: '4rem',
    paddingBottom: '4rem',
    overflow: 'hidden'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    maxWidth: '80rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const pStyle = {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#2563eb',
    letterSpacing: '0.2em',
    marginBottom: '1rem',
  };

  const h1Style = {
    fontSize: '2.25rem',
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
