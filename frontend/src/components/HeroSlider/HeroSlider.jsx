import { useState, useEffect } from 'react'
import './HeroSlider.scss'

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: 'Smart Tech Solutions for Your Business',
      description: 'Shree & Shri Associates delivers end-to-end services including cybersecurity, custom software, and web solutions.',
      image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      buttonText: 'Explore Offerings'
    },
    {
      id: 2,
      title: 'Professional Accounting Services',
      description: 'Comprehensive financial solutions tailored to your business needs.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      buttonText: 'View Services'
    },
    {
      id: 3,
      title: 'Business Growth Strategies',
      description: 'Expert consulting to help your business scale and succeed.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      buttonText: 'Learn More'
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <div className="container">
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <button className="btn btn-primary">{slide.buttonText}</button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider