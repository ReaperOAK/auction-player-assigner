import { useState } from 'react';

const AuctionControl = ({ selectedPlayer, teams, onAssignPlayer, onClose }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [price, setPrice] = useState('');

  if (!selectedPlayer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeam || !price) {
      alert('Please select a team and enter a price');
      return;
    }

    const priceNum = parseInt(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price');
      return;
    }

    onAssignPlayer(selectedPlayer.id, parseInt(selectedTeam), priceNum);
    setSelectedTeam('');
    setPrice('');
  };

  const getTeamBudgetInfo = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    
    const currentPrice = parseInt(price) || 0;
    const budgetLeft = team.budget - team.spent - currentPrice;
    
    return {
      name: team.name,
      budgetLeft: team.budget - team.spent,
      afterPurchase: budgetLeft
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg mx-4">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Assign Player</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl focus-ring" aria-label="Close dialog">×</button>
          </div>

          {/* Player Info */}
          <div className="mb-6 p-4 bg-surface-50 rounded-lg">
            <h4 className="font-semibold text-lg">{selectedPlayer.name}</h4>
            <div className="text-sm text-gray-600 mt-1">
              <p>Position: {selectedPlayer.position}</p>
              <p>Graduation Year: {selectedPlayer.year}</p>
              <p>Played Departmental?: {selectedPlayer.prevTournament ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              required
              aria-label="Choose team"
            >
              <option value="">Choose a team...</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} (Budget: {team.budget - team.spent} points)
                </option>
              ))}
            </select>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Price (Points)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              placeholder="Enter price"
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              required
              aria-label="Purchase price"
            />
          </div>

          {/* Budget Preview */}
          {selectedTeam && price && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">Budget Preview</h5>
              {(() => {
                const teamInfo = getTeamBudgetInfo(parseInt(selectedTeam));
                if (teamInfo) {
                  return (
                    <div className="text-sm space-y-1">
                      <p className="text-blue-700">
                        {teamInfo.name} - Current Budget: {teamInfo.budgetLeft} points
                      </p>
                      <p className={`font-medium ${
                        teamInfo.afterPurchase >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        After Purchase: {teamInfo.afterPurchase} points
                        {teamInfo.afterPurchase < 0 && ' (Over Budget!)'}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn btn-ghost">Cancel</button>
            <button type="submit" className="flex-1 btn btn-primary">Assign Player</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuctionControl;
