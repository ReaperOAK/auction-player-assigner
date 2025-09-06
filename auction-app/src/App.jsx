import React, { useState } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { defaultPlayers } from './data/defaultPlayers';
import { defaultTeams } from './data/defaultTeams';
import PlayerList from './components/PlayerList';
import TeamDashboard from './components/TeamDashboard';
import AuctionControl from './components/AuctionControl';
import EditPlayerModal from './components/EditPlayerModal';
import EditTeamModal from './components/EditTeamModal';
import AddPlayerModal from './components/AddPlayerModal';
import AddTeamModal from './components/AddTeamModal';
import CSVImportModal from './components/CSVImportModal';
import { generateAuctionPDF } from './utils/pdfExport';
import './App.css';

function App() {
  // Migrate existing data to ensure all players have gender field
  const migratePlayerData = (players) => {
    return players.map(player => ({
      ...player,
      gender: player.gender || 'male' // Default to male for existing players
    }));
  };

  const [players, setPlayers] = usePersistentState('auction-players', migratePlayerData(defaultPlayers));
  const [teams, setTeams] = usePersistentState('auction-teams', defaultTeams);
  const [activeTab, setActiveTab] = useState('players');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);

  // Ensure all loaded players have gender field
  React.useEffect(() => {
    const migratedPlayers = migratePlayerData(players);
    if (JSON.stringify(migratedPlayers) !== JSON.stringify(players)) {
      setPlayers(migratedPlayers);
    }
  }, []);

  const handlePlayerSelect = (player) => {
    if (player.soldTo) {
      // If player is already sold, show confirmation to remove
      if (window.confirm(`${player.name} is already sold to a team. Do you want to remove them?`)) {
        handleRemovePlayer(player.id);
      }
    } else {
      // If player is unsold, open auction control
      setSelectedPlayer(player);
    }
  };

  const handleAssignPlayer = (playerId, teamId, price) => {
    // Update player
    setPlayers(prev => prev.map(player =>
      player.id === playerId
        ? { ...player, soldTo: teamId, price }
        : player
    ));

    // Update team's spent amount
    setTeams(prev => prev.map(team =>
      team.id === teamId
        ? { ...team, spent: team.spent + price }
        : team
    ));

    setSelectedPlayer(null);
  };

  const handleRemovePlayer = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.soldTo) return;

    // Reset player
    setPlayers(prev => prev.map(p =>
      p.id === playerId
        ? { ...p, soldTo: null, price: 0 }
        : p
    ));

    // Update team's spent amount
    setTeams(prev => prev.map(team =>
      team.id === player.soldTo
        ? { ...team, spent: team.spent - player.price }
        : team
    ));
  };

  // Player editing functions
  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
  };

  const handleSavePlayer = (playerId, updatedData) => {
    setPlayers(prev => prev.map(player =>
      player.id === playerId
        ? { ...player, ...updatedData }
        : player
    ));
    setEditingPlayer(null);
  };

  const handleDeletePlayer = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (player && player.soldTo) {
      handleRemovePlayer(playerId);
    }
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const handleAddPlayer = (playerData) => {
    const newId = Math.max(...players.map(p => p.id)) + 1;
    const newPlayer = {
      id: newId,
      ...playerData,
      soldTo: null,
      price: 0
    };
    setPlayers(prev => [...prev, newPlayer]);
    setShowAddPlayer(false);
  };

  // Team editing functions
  const handleEditTeam = (team) => {
    setEditingTeam(team);
  };

  const handleSaveTeam = (teamId, updatedData) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId
        ? { ...team, ...updatedData }
        : team
    ));
    setEditingTeam(null);
  };

  const handleDeleteTeam = (teamId) => {
    // Check if team has players
    const teamPlayers = players.filter(p => p.soldTo === teamId);
    if (teamPlayers.length > 0) {
      alert('Cannot delete team with players. Remove all players first.');
      return;
    }
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  const handleAddTeam = (teamData) => {
    const newId = Math.max(...teams.map(t => t.id)) + 1;
    const newTeam = {
      id: newId,
      ...teamData,
      spent: 0,
      players: []
    };
    setTeams(prev => [...prev, newTeam]);
    setShowAddTeam(false);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear all player assignments and restore original data.')) {
      setPlayers(defaultPlayers);
      setTeams(defaultTeams);
      setSelectedPlayer(null);
      setEditingPlayer(null);
      setEditingTeam(null);
      setShowAddPlayer(false);
      setShowAddTeam(false);
    }
  };

  const handleCSVImport = (importedPlayers) => {
    // Reset teams and clear all assignments when importing new players
    setPlayers(importedPlayers);
    setTeams(defaultTeams);
    setSelectedPlayer(null);
    setEditingPlayer(null);
    setEditingTeam(null);
    setShowAddPlayer(false);
    setShowAddTeam(false);
    setShowCSVImport(false);
  };

  const handleExportData = () => {
    generateAuctionPDF(players, teams);
  };

  const totalPlayersAssigned = players.filter(p => p.soldTo).length;
  const totalSpent = teams.reduce((sum, team) => sum + team.spent, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏆 Auction Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {totalPlayersAssigned}/{players.length} players assigned • Total spent: {totalSpent} points
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCSVImport(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Import CSV
              </button>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Export PDF
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('players')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'players'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Players ({players.length})
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'teams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Teams ({teams.length})
              </button>
            </div>
            
            {/* Add buttons */}
            <div className="flex gap-2">
              {activeTab === 'players' && (
                <button
                  onClick={() => setShowAddPlayer(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
                >
                  + Add Player
                </button>
              )}
              {activeTab === 'teams' && (
                <button
                  onClick={() => setShowAddTeam(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
                >
                  + Add Team
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'players' ? (
          <PlayerList
            players={players}
            teams={teams}
            onPlayerSelect={handlePlayerSelect}
            onEditPlayer={handleEditPlayer}
            onDeletePlayer={handleDeletePlayer}
          />
        ) : (
          <TeamDashboard
            teams={teams}
            players={players}
            onRemovePlayer={handleRemovePlayer}
            onEditTeam={handleEditTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        )}
      </main>

      {/* Auction Control Modal */}
      <AuctionControl
        selectedPlayer={selectedPlayer}
        teams={teams}
        onAssignPlayer={handleAssignPlayer}
        onClose={() => setSelectedPlayer(null)}
      />

      {/* Edit Player Modal */}
      <EditPlayerModal
        player={editingPlayer}
        onSave={handleSavePlayer}
        onClose={() => setEditingPlayer(null)}
      />

      {/* Edit Team Modal */}
      <EditTeamModal
        team={editingTeam}
        onSave={handleSaveTeam}
        onClose={() => setEditingTeam(null)}
      />

      {/* Add Player Modal */}
      {showAddPlayer && (
        <AddPlayerModal
          onSave={handleAddPlayer}
          onClose={() => setShowAddPlayer(false)}
        />
      )}

      {/* Add Team Modal */}
      {showAddTeam && (
        <AddTeamModal
          onSave={handleAddTeam}
          onClose={() => setShowAddTeam(false)}
        />
      )}

      {/* CSV Import Modal */}
      {showCSVImport && (
        <CSVImportModal
          isOpen={showCSVImport}
          onClose={() => setShowCSVImport(false)}
          onImport={handleCSVImport}
        />
      )}
    </div>
  );
}

export default App;
