import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];

const RevenueChart = ({ revenueData }) => {
  const chartData = {
    labels: MONTHS,
    datasets: [{
      label: 'Aylık Gelir (₺)',
      data: revenueData,
      fill: true,
      backgroundColor: 'rgba(59,130,246,0.15)',
      borderColor: '#3b82f6',
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
    }]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#94a3b8', callback: v => `₺${v.toLocaleString()}` }, grid: { color: '#334155' } }
    }
  };

  return (
    <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '25px' }}>
      <h3 style={{ margin: '0 0 20px', color: '#f1f5f9' }}>Aylık Gelir Grafiği</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;