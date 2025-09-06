import { IconEdit, IconTrash, IconMale, IconFemale, IconWarning } from './Icons';

const TeamDashboard = ({ teams, players, onRemovePlayer, onEditTeam, onDeleteTeam }) => {
  const getTeamPlayers = (teamId) => {
    return players.filter(player => player.soldTo === teamId);
  };

  const getPositionCount = (teamPlayers, position) => {
    return teamPlayers.filter(player => player.position === position).length;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Teams Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map(team => {
          const teamPlayers = getTeamPlayers(team.id);
          const totalSpent = teamPlayers.reduce((sum, player) => sum + player.price, 0);
          const budgetLeft = team.budget - totalSpent;
          
          return (
            <section key={team.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                  <p className="text-xs text-gray-500">{teamPlayers.length} players • Budget: {team.budget} pts</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Budget Left</p>
                    <p className={`font-bold ${budgetLeft < 0 ? 'text-red-600' : 'text-green-600'}`}>{budgetLeft} pts</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => onEditTeam(team)} className="text-primary-700 hover:text-primary-800 text-sm px-2 py-1 rounded focus-ring" aria-label={`Edit ${team.name}`}><IconEdit className="w-4 h-4" /></button>
                    <button onClick={() => { if (teamPlayers.length > 0) { alert('Cannot delete team with players. Remove all players first.'); return; } if (window.confirm(`Are you sure you want to delete ${team.name}?`)) { onDeleteTeam(team.id); } }} className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded focus-ring" aria-label={`Delete ${team.name}`}><IconTrash className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-surface-50 rounded">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Total Budget</p>
                  <p className="font-semibold">{team.budget} pts</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Spent</p>
                  <p className="font-semibold text-red-600">{totalSpent} pts</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Players</p>
                  <p className="font-semibold">{teamPlayers.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {['GK', 'DEF', 'MID', 'ATT'].map(pos => (
                  <div key={pos} className="text-center p-2 bg-white border rounded">
                    <p className="text-xs text-gray-600">{pos}</p>
                    <p className="font-semibold">{getPositionCount(teamPlayers, pos)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 border-b pb-1">Squad</h4>
                {teamPlayers.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {teamPlayers.map(player => (
                      <div key={player.id} className="flex justify-between items-center p-2 bg-surface-50 rounded text-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{player.name}</p>
                            <span className="text-xs">{(player.gender || 'male') === 'female' ? <IconFemale className="w-4 h-4" /> : <IconMale className="w-4 h-4" />}</span>
                          </div>
                          <p className="text-xs text-gray-600">{player.position} • {player.year}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">{player.price} pts</span>
                          <button onClick={() => onRemovePlayer(player.id)} className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded focus-ring">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic py-4 text-center">No players acquired yet</p>
                )}
              </div>

              {budgetLeft < 0 && (
                <div className="mt-4 p-2 bg-red-100 border border-red-300 rounded flex items-center gap-2">
                  <IconWarning className="w-4 h-4 text-red-700" />
                  <p className="text-red-700 text-sm font-medium">Over budget by {Math.abs(budgetLeft)} points</p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default TeamDashboard;
