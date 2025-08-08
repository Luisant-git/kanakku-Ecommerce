import './About.scss'

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">About SHREE & SHRI ASSOCIATES</h1>
        
        <div className="about-content">
          <div className="about-image">
            <img src="https://www.youroffice.com/wp-content/uploads/2021/03/121-south-orange-avenue-suite-1500-orlando-fl-32801-17-scaled.jpg" alt="Our Office" />
          </div>
          
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              Founded in 2005, SHREE & SHRI ASSOCIATES has been providing top-notch accounting 
              and financial services to businesses in Salem and beyond. Our team of certified 
              professionals is dedicated to helping clients navigate the complex world of finance 
              with ease and confidence.
            </p>
            
            <h2>Our Mission</h2>
            <p>
              We strive to simplify accounting processes for our clients through innovative 
              solutions, personalized service, and cutting-edge technology. Our mission is to 
              empower businesses with the financial tools and knowledge they need to thrive.
            </p>
            
            <h2>Our Values</h2>
            <ul>
              <li>Integrity in all our dealings</li>
              <li>Excellence in service delivery</li>
              <li>Innovation in solutions</li>
              <li>Commitment to client success</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About