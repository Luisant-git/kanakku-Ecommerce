import { FiDollarSign, FiShoppingBag, FiUsers, FiPieChart } from 'react-icons/fi'
import './StatsCard.scss'

const StatsCard = ({ title, value, change, icon, color }) => {
  const getIcon = () => {
    switch (icon) {
      case 'dollar':
        return <FiDollarSign />
      case 'bag':
        return <FiShoppingBag />
      case 'users':
        return <FiUsers />
      case 'chart':
        return <FiPieChart />
      default:
        return <FiDollarSign />
    }
  }

  const isPositive = change.startsWith('+')

  return (
    <div className={`stats-card ${color}`}>
      <div className="icon">{getIcon()}</div>
      <div className="content">
        <h3>{title}</h3>
        <p className="value">{value}</p>
        <p className={`change ${isPositive ? 'positive' : 'negative'}`}>
          {change}
        </p>
      </div>
    </div>
  )
}

export default StatsCard