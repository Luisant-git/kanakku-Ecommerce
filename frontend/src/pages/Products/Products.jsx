import { useEffect, useState } from 'react'
import ProductCard from '../../components/ProductCard/ProductCard'
import './Products.scss'
import { getAllProductsApi } from '../../api/Product'

const Products = () => {
  const [products, setProducts] = useState([]);
  const getAllProducts = async () => {
    // API call to fetch products
    const response = await getAllProductsApi();
    console.log("all products", response);
    setProducts(response);
  };

  useEffect(() => {
    getAllProducts();
  }, [])

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Our Products</h1>

        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products