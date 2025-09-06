import { useState } from 'react';

const EditPlayerModal = ({ player, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: player?.name || '',
    year: player?.year || '',
    position: player?.position || 'MID',
  prevTournament: player?.prevTournament || false,
  gender: player?.gender || 'male',
  department: player?.department || 'CSE'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.year.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(player.id, formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Edit Player</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl focus-ring" aria-label="Close dialog">×</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter player name"
              required
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Graduation Year *
            </label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2023"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position *
            </label>
            <select
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="GK">Goalkeeper (GK)</option>
              <option value="DEF">Defender (DEF)</option>
              <option value="MID">Midfielder (MID)</option>
              <option value="ATT">Attacker (ATT)</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="male">Boy</option>
              <option value="female">Girl</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EE">EE</option>
              <option value="IT">IT</option>
              <option value="AIML">AIML</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Played Departmental? */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.prevTournament}
                onChange={(e) => handleChange('prevTournament', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Played Departmental?
              </span>
            </label>
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

export default EditPlayerModal;
