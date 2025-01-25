import { Line } from 'react-chartjs-2';

export function FeedbackTrends({ feedbacks }) {
  // Process data for chart
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Feedback Submissions',
      data: [12, 19, 3, 5, 2, 3, 7],
      fill: false,
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1
    }]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Feedback Trends</h2>
      <Line data={data} options={{ responsive: true }} />
    </div>
  );
} 