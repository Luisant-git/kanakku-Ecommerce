import { useState } from 'react'
import './Contact.scss'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="contact-page">
      {/* Google Map Background */}
      <div className="map-background">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.7119733163235!2d78.14523341483074!3d11.662050492075838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf0302274ddff%3A0x20564e1ec65d8f5!2s14B%2C%20Mettu%20Agraharam%20St%2C%20Salem%2C%20Tamil%20Nadu%20636001!5e0!3m2!1sen!2sin!4v1691553276269!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Shree & Shri Map"
        ></iframe>
      </div>

      <div className="container">
        <h1 className="page-title">Contact Us</h1>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have questions about our products or services? Reach out to our team and we'll 
              get back to you as soon as possible.
            </p>

            <div className="info-item">
              <h3>Address</h3>
              <p>New : No: 51/ Old No: 14-B, Mettu Agraharam Street, Salem - 636 001</p>
            </div>

            <div className="info-item">
              <h3>Email</h3>
              <p>info@shreeshri.com</p>
            </div>

            <div className="info-item">
              <h3>Phone</h3>
              <p>+91 9876543210</p>
            </div>

            <div className="info-item">
              <h3>GSTN</h3>
              <p>33ABZFS2715A1Z8</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                required 
              ></textarea>
            </div>

            <button type="submit" className="btn btn--primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
