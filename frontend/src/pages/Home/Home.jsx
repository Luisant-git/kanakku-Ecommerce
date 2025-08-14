import { Link } from 'react-router-dom'
import HeroSlider from '../../components/HeroSlider/HeroSlider'
import ProductCard from '../../components/ProductCard/ProductCard'
import './Home.scss'
import { useEffect, useState } from 'react'
import { getAllProductsApi } from '../../api/Product'

// Updated featured products
// const featuredProducts = [
//   {
//     id: 1,
//     name: 'Premium Accounting Software',
//     price: 4999,
//     image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
//     category: 'Software'
//   },
//   {
//     id: 2,
//     name: 'Business Tax Guide',
//     price: 999,
//     image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80',
//     category: 'Books'
//   },
//   {
//     id: 3,
//     name: 'Financial Planning Service',
//     price: 2999,
//     image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
//     category: 'Services'
//   },
//   {
//     id: 4,
//     name: 'GST Filing Assistance',
//     price: 1999,
//     image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
//     category: 'Services'
//   },
//   {
//     id: 5,
//     name: 'Company Registration Package',
//     price: 5999,
//     image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
//     category: 'Services'
//   },
//   {
//     id: 6,
//     name: 'Advanced Excel for Accountants',
//     price: 1499,
//     image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
//     category: 'Books'
//   }
// ]
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const getAllProducts = async () => {
    // API call to fetch products
    const response = await getAllProductsApi();
    console.log("all products", response);
    setFeaturedProducts(response);
  };

  useEffect(() => {
    getAllProducts();
  }, [])
  return (
    <div className="home">
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Featured Products */}
      <section className="featured">
        <div className="container">
          <h2 className="section-title">Featured Solutions</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services__grid">
            <div className="service-card">
              <h3>Cybersecurity Infrastructure</h3>
              <p>Design and deploy robust security networks to protect digital assets and sensitive data.</p>
            </div>
            <div className="service-card">
              <h3>Web Development</h3>
              <p>Responsive, user-friendly websites and web applications tailored for your brand.</p>
            </div>
            <div className="service-card">
              <h3>Software Integration</h3>
              <p>Custom software tools, automation workflows, and business process optimization.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home