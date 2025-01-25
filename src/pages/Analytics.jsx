import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { FaStar } from 'react-icons/fa';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

function Analytics() {
  const { feedbacks } = useSelector((state) => state.feedback);
  const { user } = useSelector((state) => state.auth);
  const [metrics, setMetrics] = useState({
    total: 0,
    productFeedbacks: 0,
    serviceFeedbacks: 0
  });
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [priorityData, setPriorityData] = useState({ labels: [], datasets: [] });
  const [trendsData, setTrendsData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Process data for charts and metrics
    const categories = {};
    const priorities = {};
    let productCount = 0;
    let serviceCount = 0;

    feedbacks.forEach((feedback) => {
      // Update counts
      categories[feedback.category] = (categories[feedback.category] || 0) + 1;
      priorities[feedback.priority] = (priorities[feedback.priority] || 0) + 1;
      
      // Track metrics
      if (feedback.category === 'Product') productCount++;
      if (feedback.category === 'Service') serviceCount++;
    });

    setMetrics({
      total: feedbacks.length,
      productFeedbacks: productCount,
      serviceFeedbacks: serviceCount
    });

    // Chart configurations
    setCategoryData({
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 1
      }]
    });

    setPriorityData({
      labels: Object.keys(priorities),
      datasets: [{
        data: Object.values(priorities),
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        borderWidth: 1
      }]
    });

    // Process data for trends
    const trendsMap = feedbacks.reduce((acc, feedback) => {
      const date = new Date(feedback.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Sort dates and get last 7 days of data
    const sortedDates = Object.keys(trendsMap).sort((a, b) => new Date(a) - new Date(b));
    const recentDates = sortedDates.slice(-7);
    
    setTrendsData({
      labels: recentDates,
      datasets: [{
        label: 'Number of Feedbacks',
        data: recentDates.map(date => trendsMap[date]),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    });
  }, [feedbacks]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title and Header
    doc.setFontSize(20);
    doc.text('Feedback Analytics Report', 20, 20);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Summary Metrics
    doc.setFontSize(14);
    doc.text('Summary Metrics:', 20, 45);
    doc.setFontSize(12);
    doc.text([
      `Total Feedbacks: ${metrics.total}`,
      `Product Feedbacks: ${metrics.productFeedbacks}`,
      `Service Feedbacks: ${metrics.serviceFeedbacks}`
    ], 25, 55);

    // Detailed Feedback List
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Detailed Feedback List:', 20, 20);
    
    let yPos = 35;
    feedbacks.forEach((feedback, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Feedback #${index + 1}`, 20, yPos);
      doc.setFont(undefined, 'normal');
      
      // Feedback details
      doc.setFontSize(10);
      const details = [
        `Title: ${feedback.title}`,
        `Category: ${feedback.category}`,
        `Priority: ${feedback.priority}`,
        `Status: ${feedback.status}`,
        `Description: ${feedback.description}`,
        `Date: ${new Date(feedback.createdAt).toLocaleDateString()}`,
        '----------------------------------------'
      ];

      details.forEach(detail => {
        yPos += 7;
        // Check if we need a new page
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(detail, 25, yPos);
      });
      
      yPos += 10; // Add space between feedback entries
    });

    // Save the PDF
    doc.save('feedback-analytics-report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(feedbacks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedbacks');
    XLSX.writeFile(workbook, 'feedback-data.xlsx');
  };

  return (
    <div className="space-y-8">
      {/* Header Section with improved styling */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive overview of feedback performance and trends</p>
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Feedbacks</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{metrics.total}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Product Feedback</p>
                <p className="text-2xl font-bold text-indigo-900 mt-1">
                  {feedbacks.filter(f => f.category === 'Product').length}
                </p>
              </div>
              <div className="bg-indigo-500/10 p-3 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Service Feedback</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">
                  {feedbacks.filter(f => f.category === 'Service').length}
                </p>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-full">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid with improved styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Category Distribution</h2>
            <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
              All time
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Pie 
              data={categoryData} 
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20
                    }
                  }
                },
                maintainAspectRatio: false
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Priority Distribution</h2>
            <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
              All time
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Pie 
              data={priorityData} 
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20
                    }
                  }
                },
                maintainAspectRatio: false
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Feedback Trends</h2>
            <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
              Last 7 days
            </div>
          </div>
          <div className="h-[300px]">
            <Line
              data={trendsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      font: {
                        size: 12
                      }
                    },
                    grid: {
                      color: '#f1f5f9'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Insights Section with improved styling */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Key Insights</h2>
          <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
            Current Period
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Category Distribution</h3>
            <div className="space-y-4">
              {categoryData.datasets?.[0]?.data ? (
                Object.entries(categoryData.datasets[0].data || {}).map(([index, value]) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryData.datasets[0].backgroundColor[index] }}
                      ></div>
                      <span className="text-sm text-gray-600">{categoryData.labels?.[index]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {value}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({feedbacks.length > 0 ? ((value / feedbacks.length) * 100).toFixed(1) : '0'}%)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Loading category data...</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Trend Analysis</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {trendsData.datasets?.[0]?.data ? (
                <>
                  <p>• Most active day: {
                    trendsData.labels?.[
                      trendsData.datasets[0].data.indexOf(Math.max(...trendsData.datasets[0].data))
                    ] || 'No data'
                  }</p>
                  <p>• Average daily feedback: {
                    trendsData.datasets[0].data.length > 0
                      ? (trendsData.datasets[0].data.reduce((a, b) => a + b, 0) / trendsData.datasets[0].data.length).toFixed(1)
                      : '0'
                  }</p>
                  <p>• Most common category: {
                    categoryData.datasets?.[0]?.data
                      ? categoryData.labels?.[
                          categoryData.datasets[0].data.indexOf(Math.max(...categoryData.datasets[0].data))
                        ]
                      : 'No data'
                  }</p>
                </>
              ) : (
                <p>Loading trend data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics; 