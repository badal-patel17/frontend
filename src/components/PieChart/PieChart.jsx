// src/components/PieChartBox.jsx

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartBox = () => {
  const data = {
  labels: ['Submitted', 'Fallout', 'In Progress'],
    datasets: [
      {
        label: 'Status Breakdown',
        data: [3, 2, 1], // Adjust based on your data
        backgroundColor: ['#60a5fa', '#f87171', '#facc15'], // blue, red, yellow
        borderWidth: 1,
      },
    ],
  };

  return (
<div style={{

      backgroundColor: '#171c3b',

      padding: '20px',

      backdropFilter: 'blur(8px)',

      width: '200px',

      height: '200px'

    }}>
<h3 style={{ color: '#ffda85' }}>Order Status</h3>
<Pie data={data} />
</div>

  );

};

export default PieChartBox;
 