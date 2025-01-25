import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFeedbacks, deleteFeedback } from '../store/slices/feedbackSlice';
import { toast } from 'react-toastify';
import { FaFilter, FaStar, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

function Dashboard() {
  const dispatch = useDispatch();
  const { feedbacks, isLoading } = useSelector((state) => state.feedback);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    feedbackId: null
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        await dispatch(getFeedbacks()).unwrap();
      } catch (err) {
        toast.error(err);
      }
    };
    fetchFeedbacks();
  }, [dispatch]);

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'text-red-600',
      Medium: 'text-yellow-600',
      Low: 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const filteredFeedbacks = feedbacks
    .filter(feedback => {
      // Category filter
      if (activeCategory !== 'All') {
        return feedback.category === activeCategory;
      }
      return true;
    })
    .filter(feedback =>
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'priority') {
        const priority = { High: 3, Medium: 2, Low: 1 };
        return priority[b.priority] - priority[a.priority];
      }
      return 0;
    });

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title and Header
    doc.setFontSize(20);
    doc.text('Feedback Report', 20, 20);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Summary
    doc.setFontSize(14);
    doc.text('Summary:', 20, 45);
    doc.setFontSize(12);
    doc.text([
      `Total Feedbacks: ${feedbacks.length}`,
      `High Priority Items: ${feedbacks.filter(f => f.priority === 'High').length}`
    ], 25, 55);

    // Feedback Details
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Detailed Feedback:', 20, 20);
    
    let yPos = 40;
    feedbacks.forEach((feedback, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`#${index + 1} - ${feedback.title}`, 20, yPos);
      doc.setFont(undefined, 'normal');
      
      yPos += 10;
      doc.setFontSize(10);
      doc.text([
        `Category: ${feedback.category}`,
        `Priority: ${feedback.priority}`,
        `Submitted by: ${feedback.user?.name || 'Anonymous'}`,
        `Date: ${new Date(feedback.createdAt).toLocaleDateString()}`,
        `Description: ${feedback.description}`
      ], 25, yPos);
      
      yPos += 35;
    });

    doc.save('feedback-report.pdf');
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    const exportData = feedbacks.map(feedback => ({
      Title: feedback.title,
      Category: feedback.category,
      Priority: feedback.priority,
      Satisfaction: `${feedback.satisfaction}/5`,
      Description: feedback.description,
      'Submitted By': feedback.user?.name || 'Anonymous',
      'Submission Date': new Date(feedback.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedbacks');
    XLSX.writeFile(workbook, 'feedback-report.xlsx');
    setShowExportMenu(false);
  };

  const exportToCSV = () => {
    const exportData = feedbacks.map(feedback => ({
      Title: feedback.title,
      Category: feedback.category,
      Priority: feedback.priority,
      Satisfaction: `${feedback.satisfaction}/5`,
      Description: feedback.description,
      'Submitted By': feedback.user?.name || 'Anonymous',
      'Submission Date': new Date(feedback.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'feedback-report.csv';
    link.click();
    setShowExportMenu(false);
  };

  const handleDelete = async (feedbackId) => {
    try {
      await dispatch(deleteFeedback(feedbackId)).unwrap();
      toast.success('Feedback deleted successfully');
    } catch (error) {
      toast.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track feedback submissions</p>
        </div>
        <div className="flex gap-3">
          {user?.role !== 'admin' && (
            <Link to="/feedback/new" className="btn btn-primary">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Feedback
              </span>
            </Link>
          )}
          {user?.role === 'admin' && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn btn-secondary"
              >
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </span>
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={exportToPDF}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
          <div className="relative flex-1 md:max-w-xs">
            <input
              type="text"
              placeholder="Search feedback..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {['All', 'Product', 'Service', 'Support', 'Other'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading feedbacks...</p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">No feedbacks found</p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div key={feedback._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{feedback.title}</h3>
                    <span className="text-sm text-gray-500">
                      • submitted by {feedback.user?.name || feedback.user?.email || 'Anonymous'}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{feedback.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">{feedback.category}</span>
                    <span className={`font-medium ${getPriorityColor(feedback.priority)}`}>
                      {feedback.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, feedbackId: feedback._id })}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                      title="Delete feedback"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, feedbackId: null })}
        onConfirm={() => handleDelete(deleteDialog.feedbackId)}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
      />
    </div>
  );
}

export default Dashboard; 