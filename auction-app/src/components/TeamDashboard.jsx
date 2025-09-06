import { IconEdit, IconTrash, IconMale, IconFemale, IconWarning } from './Icons';

const TeamDashboard = ({ teams, players, onRemovePlayer, onEditTeam, onDeleteTeam }) => {
  const getTeamPlayers = (teamId) => {
    return players.filter(player => player.soldTo === teamId);
  };

  const getPositionCount = (teamPlayers, position) => {
    return teamPlayers.filter(player => player.position === position).length;
  };

  const getDepartmentCounts = (teamPlayers) => {
    return teamPlayers.reduce((acc, p) => {
      const d = (p.department || 'Unknown').toUpperCase();
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Teams Dashboard</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {teams.map(team => {
          const teamPlayers = getTeamPlayers(team.id);
          const totalSpent = teamPlayers.reduce((sum, player) => sum + player.price, 0);
          const budgetLeft = team.budget - totalSpent;
          
          return (
            <section key={team.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
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

              <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-surface-50 rounded">
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

              <div className="grid grid-cols-4 gap-1 mb-2">
                {['GK', 'DEF', 'MID', 'ATT'].map(pos => (
                  <div key={pos} className="text-center p-2 bg-white border rounded">
                    <p className="text-xs text-gray-600">{pos}</p>
                    <p className="font-semibold">{getPositionCount(teamPlayers, pos)}</p>
                  </div>
                ))}
              </div>

              {/* Department composition badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {(() => {
                  const counts = getDepartmentCounts(teamPlayers);
                  const entries = Object.entries(counts).sort((a,b) => b[1]-a[1]);
                  const captainDept = team.captainDepartment ? team.captainDepartment.toUpperCase() : null;
                  return entries.length ? entries.map(([dept, cnt]) => (
                    <span key={dept} className={`text-xs px-2 py-0.5 rounded-full border ${captainDept === dept ? 'bg-primary-100 border-primary-300 text-primary-800 font-semibold' : 'bg-surface-100 border-gray-200 text-gray-700'}`}>
                      {dept}: {cnt}
                    </span>
                  )) : (
                    <span className="text-xs text-gray-500">No departments</span>
                  );
                })()}
              </div>

              <div className="flex-1 flex flex-col">
                <h4 className="font-semibold text-gray-700 border-b pb-1">Squad — Owner: {team.owner || 'N/A'}</h4>
                {teamPlayers.length > 0 ? (
                  <div className="overflow-y-auto space-y-2 py-2">
                    {teamPlayers.map(player => (
                      <div key={player.id} className="flex justify-between items-center p-2 bg-surface-50 rounded text-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{player.name} <span className="text-xxs text-gray-500 ml-1">{player.department}</span>{player.isCaptain ? <span className="ml-2 text-xs px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded">Captain</span> : null}</p>
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
