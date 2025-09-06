import { useState } from 'react';

const PlayerList = ({ players, teams, onPlayerSelect, onEditPlayer, onDeletePlayer }) => {
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');

  const positions = ['ALL', 'GK', 'DEF', 'MID', 'ATT'];
  const statuses = ['ALL', 'SOLD', 'UNSOLD'];
  const genders = ['ALL', 'MALE', 'FEMALE'];

  const filteredPlayers = players.filter(player => {
    // Ensure player has gender field, default to 'male' if missing
    const playerGender = player.gender || 'male';
    
    const positionMatch = positionFilter === 'ALL' || player.position === positionFilter;
    const statusMatch = statusFilter === 'ALL' || 
      (statusFilter === 'SOLD' && player.soldTo) ||
      (statusFilter === 'UNSOLD' && !player.soldTo);
    const genderMatch = genderFilter === 'ALL' || 
      (genderFilter === 'MALE' && playerGender === 'male') ||
      (genderFilter === 'FEMALE' && playerGender === 'female');
    
    return positionMatch && statusMatch && genderMatch;
  });

  const getPlayerStatus = (player) => {
    if (player.soldTo) {
      const team = teams.find(t => t.id === player.soldTo);
      return { status: 'SOLD', team: team?.name, price: player.price };
    }
    return { status: 'UNSOLD', team: null, price: 0 };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Players</h2>
      
      {/* Filter sections */}
      <div className="space-y-4 mb-6">
        {/* Position Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Position</label>
          <div className="flex flex-wrap gap-2">
            {positions.map(pos => (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                  positionFilter === pos
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                  statusFilter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Gender</label>
          <div className="flex flex-wrap gap-2">
            {genders.map(gender => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                  genderFilter === gender
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {gender === 'FEMALE' ? 'GIRLS' : gender}
              </button>
            ))}
          </div>
        </div>

        {/* Active filters summary */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Showing:</span>
          <span className="font-medium">{filteredPlayers.length} of {players.length} players</span>
          {(positionFilter !== 'ALL' || statusFilter !== 'ALL' || genderFilter !== 'ALL') && (
            <button
              onClick={() => {
                setPositionFilter('ALL');
                setStatusFilter('ALL');
                setGenderFilter('ALL');
              }}
              className="text-blue-600 hover:text-blue-800 underline ml-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Players grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map(player => {
          const playerStatus = getPlayerStatus(player);
          return (
            <div
              key={player.id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                playerStatus.status === 'SOLD'
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{player.name}</h3>
                  <p className="text-xs text-gray-500">
                    {(player.gender || 'male') === 'female' ? '👩 Girl' : '👨 Boy'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    player.position === 'GK' ? 'bg-yellow-100 text-yellow-800' :
                    player.position === 'DEF' ? 'bg-blue-100 text-blue-800' :
                    player.position === 'MID' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {player.position}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPlayer(player);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50"
                      title="Edit player"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${player.name}?`)) {
                          onDeletePlayer(player.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
                      title="Delete player"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>Year: {player.year}</p>
                <p>Prev Tournament: {player.prevTournament ? 'Yes' : 'No'}</p>
                
                {playerStatus.status === 'SOLD' ? (
                  <div className="mt-2 p-2 bg-green-100 rounded">
                    <p className="text-green-800 font-medium">SOLD</p>
                    <p className="text-green-700">Team: {playerStatus.team}</p>
                    <p className="text-green-700">Price: {playerStatus.price} points</p>
                  </div>
                ) : (
                  <div 
                    className="mt-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                    onClick={() => onPlayerSelect(player)}
                  >
                    <p className="text-gray-700 font-medium">UNSOLD</p>
                    <p className="text-gray-600 text-xs">Click to assign to team</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
