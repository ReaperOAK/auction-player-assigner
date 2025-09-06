import { useState } from 'react';
import { IconWarning } from './Icons';

const EditTeamModal = ({ team, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
  budget: team?.budget || 1000,
  owner: team?.owner || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a team name');
      return;
    }

    const budget = parseInt(formData.budget);
    if (isNaN(budget) || budget <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

  onSave(team.id, { ...formData, budget, owner: formData.owner || null });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!team) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Edit Team</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl focus-ring" aria-label="Close dialog">×</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter team name"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (points) *
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter budget amount"
                required
              />
            </div>

              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => handleChange('owner', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter owner name"
                />
              </div>

            {/* Current spending info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Current spent:</strong> {team.spent} points
              </p>
              <p className="text-sm text-gray-600">
                <strong>New budget remaining:</strong> {parseInt(formData.budget || 0) - team.spent} points
              </p>
              {(parseInt(formData.budget || 0) - team.spent) < 0 && (
                <p className="text-sm text-red-600 font-medium mt-1 flex items-center gap-2"><IconWarning className="w-4 h-4 text-red-600" /> Warning: New budget is less than current spending!</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 btn btn-ghost">Cancel</button>
              <button type="submit" className="flex-1 btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
