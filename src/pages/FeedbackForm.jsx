import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createFeedback } from '../store/slices/feedbackSlice';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

function FeedbackForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    satisfaction: 0
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const { title, description, category, priority, satisfaction } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !priority || !satisfaction) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await dispatch(createFeedback(formData)).unwrap();
      toast.success('Feedback submitted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold mb-6">Submit Feedback</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              className="input"
              placeholder="Enter feedback title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={category}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select category</option>
              <option value="Product">Product</option>
              <option value="Service">Service</option>
              <option value="Support">Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={priority}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Satisfaction Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, satisfaction: rating }))}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`w-8 h-8 ${
                      rating <= (hoveredRating || satisfaction)
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              className="input min-h-[120px]"
              placeholder="Enter feedback description"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm; 