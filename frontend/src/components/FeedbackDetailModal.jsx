import { Dialog } from '@headlessui/react';
import { FaStar } from 'react-icons/fa';

export function FeedbackDetailModal({ isOpen, feedback, onClose }) {
  if (!feedback) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg p-6">
          <Dialog.Title className="text-xl font-semibold">{feedback.title}</Dialog.Title>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Submitted by</span>
              <span className="font-medium">{feedback.user?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{feedback.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Priority</span>
              <span className={`font-medium ${getPriorityColor(feedback.priority)}`}>
                {feedback.priority}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Satisfaction Rating</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < feedback.satisfaction ? 'text-yellow-400' : 'text-gray-200'}
                  />
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{feedback.description}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 