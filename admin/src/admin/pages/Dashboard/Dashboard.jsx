import { Line, Doughnut } from 'react-chartjs-2'
import '../../../utils/chartSetup'
import ChartCard from '../../components/ChartCard/ChartCard'
import StatsCard from '../../components/StatsCard/StatsCard'
import { FiSearch, FiBell, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Dashboard.scss'

// --- Product Card Component ---
const ProductCard = ({ image, name, quantity }) => {
  return (
    <div className="product-card">
      <div className="product-card__image-container">
        <img src={image} alt={name} className="product-card__image" />
      </div>
      <p className="product-card__name">{name}</p>
      <p className="product-card__quantity">{quantity}</p>
    </div>
  )
}

const Dashboard = () => {
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [4000, 3000, 5000, 2780, 1890, 2390],
      borderColor: 'rgba(79, 70, 229, 1)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4
    }]
  }

  const targetData = {
    labels: ['Achieved', 'Remaining', 'Pending', 'Completed'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: [
        'rgba(79, 70, 229, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ]
    }]
  }

  const topProducts = [
    { image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop', name: 'MacBook Pro', quantity: '45 Pcs' },
    { image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&h=150&fit=crop', name: 'Dell XPS 13', quantity: '32 Pcs' },
    { image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150&h=150&fit=crop', name: 'HP Pavilion', quantity: '28 Pcs' },
    { image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=150&h=150&fit=crop', name: 'Lenovo ThinkPad', quantity: '38 Pcs' },
    { image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150&h=150&fit=crop', name: 'ASUS VivoBook', quantity: '25 Pcs' }
  ]

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <button className="date-btn">
            <FiCalendar />
            <span>30 May</span>
          </button>
          <button className="icon-btn">
            <FiBell />
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        <StatsCard title="Total Revenue" value="$250,430" change="+15.3%" color="primary" />
        <StatsCard title="Total Orders" value="8,249" change="+8.1%" color="secondary" />
        <StatsCard title="Total Customers" value="1,324" change="-2.1%" color="info" />
        <StatsCard title="Pending Delivery" value="89" change="+12.5%" color="warning" />
      </div>

      <div className="chart-grid">
        <ChartCard title="Sales Overview">
          <Line data={salesData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
        <ChartCard title="Sales Target">
          <Doughnut data={targetData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
      </div>

      <div className="products-grid">
        <div className="chart-card">
          <div className="card-header">
            <h3>Top Selling Products</h3>
            <div className="nav-arrows">
              <button onClick={() => document.getElementById('productsList').scrollBy({left: -200, behavior: 'smooth'})}>
                <FiChevronLeft />
              </button>
              <button onClick={() => document.getElementById('productsList').scrollBy({left: 200, behavior: 'smooth'})}>
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div className="products-list" id="productsList">
            {topProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
        <ChartCard title="Current Offers">
          <div className="offers-list">
            <div className="offer-item">
              <div className="offer-info">
                <p className="offer-title">40% Discount Offer</p>
                <span className="offer-expiry">Expire on: 05-08-2...</span>
              </div>
              <div className="offer-bar">
                <div className="offer-progress" style={{ width: '70%', backgroundColor: '#6B7280' }}></div>
              </div>
            </div>
            <div className="offer-item">
              <div className="offer-info">
                <p className="offer-title">100 Taka Coupon</p>
                <span className="offer-expiry">Expire on: 10-09-2...</span>
              </div>
              <div className="offer-bar">
                <div className="offer-progress" style={{ width: '50%', backgroundColor: '#6B7280' }}></div>
              </div>
            </div>
            <div className="offer-item">
              <div className="offer-info">
                <p className="offer-title">Stock Out Sale</p>
                <span className="offer-expiry upcoming">Upcoming on: 14-09-2...</span>
              </div>
              <div className="offer-bar">
                <div className="offer-progress" style={{ width: '90%', backgroundColor: '#2DD4BF' }}></div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default Dashboard