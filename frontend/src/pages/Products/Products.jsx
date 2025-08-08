import { useState } from 'react'
import ProductCard from '../../components/ProductCard/ProductCard'
import './Products.scss'

// Temporary data - replace with API call
const products = [
  {
    id: 1,
    name: 'Premium Accounting Software',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    category: 'Software'
  },
  {
    id: 2,
    name: 'Business Tax Guide',
    price: 999,
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80',
    category: 'Books'
  },
  {
    id: 3,
    name: 'Financial Planning Service',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    category: 'Services'
  },
  {
    id: 4,
    name: 'GST Filing Assistance',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    category: 'Services'
  },
  {
    id: 5,
    name: 'Company Registration Package',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
    category: 'Services'
  },
  {
    id: 6,
    name: 'Advanced Excel for Accountants',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    category: 'Books'
  }
]

const Products = () => {
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = ['all', ...new Set(products.map(product => product.category))]

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => product.category === categoryFilter)

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Our Products</h1>

        <div className="products-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products