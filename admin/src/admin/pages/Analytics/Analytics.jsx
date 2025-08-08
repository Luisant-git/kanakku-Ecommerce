import { Line, Doughnut } from 'react-chartjs-2'
import '../../../utils/chartSetup'
import ChartCard from '../../components/ChartCard/ChartCard'
import StatsCard from '../../components/StatsCard/StatsCard'
import './Analytics.scss'

const Analytics = () => {
  const trafficData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Website Traffic',
      data: [4000, 3000, 5000, 2780, 1890, 2390],
      borderColor: 'rgba(79, 70, 229, 1)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4
    }]
  }

  const sourceData = {
    labels: ['Direct', 'Social Media', 'Email', 'Search'],
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

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Analytics</h1>
      </div>
      
      <div className="stats-grid">
        <StatsCard title="Page Views" value="125,430" change="+15.3%" color="primary" />
        <StatsCard title="Unique Visitors" value="8,249" change="+8.1%" color="secondary" />
        <StatsCard title="Bounce Rate" value="32.4%" change="-2.1%" color="info" />
        <StatsCard title="Avg. Session" value="4m 32s" change="+12.5%" color="warning" />
      </div>

      <div className="chart-grid">
        <ChartCard title="Traffic Overview">
          <Line data={trafficData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
        <ChartCard title="Traffic Sources">
          <Doughnut data={sourceData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
      </div>
    </div>
  )
}

export default Analytics