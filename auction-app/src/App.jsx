import React, { useState } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { defaultPlayers } from './data/defaultPlayers';
import { defaultCaptains } from './data/defaultCaptains';
import { defaultTeams } from './data/defaultTeams';
import PlayerList from './components/PlayerList';
import TeamDashboard from './components/TeamDashboard';
import AuctionControl from './components/AuctionControl';
import RandomPlayerPicker from './components/RandomPlayerPicker';
import EditPlayerModal from './components/EditPlayerModal';
import EditTeamModal from './components/EditTeamModal';
import AddPlayerModal from './components/AddPlayerModal';
import AddTeamModal from './components/AddTeamModal';
import CSVImportModal from './components/CSVImportModal';
import Header from './components/Header';
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

  const mergeCaptains = (playersList) => {
    // avoid duplicates: only add captains that don't exist in the list
    const existingIds = new Set(playersList.map(p => p.id));
    const captainsToAdd = defaultCaptains.filter(c => !existingIds.has(c.id));
    return [...playersList, ...captainsToAdd];
  };

  const [players, setPlayers] = usePersistentState('auction-players', migratePlayerData(mergeCaptains(defaultPlayers)));
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
  setPlayers(mergeCaptains(defaultPlayers));
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
  setPlayers(mergeCaptains(importedPlayers));
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
    <div className="min-h-screen bg-surface-50">
      <Header
        totalPlayersAssigned={totalPlayersAssigned}
        totalPlayers={players.length}
        totalSpent={totalSpent}
        onImportCSV={() => setShowCSVImport(true)}
        onExportPDF={handleExportData}
        onReset={handleResetData}
      />

      {/* Navigation */}
      <nav className="bg-transparent border-b">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('players')}
              className={`py-2 px-3 rounded-md font-medium text-sm transition ${
                activeTab === 'players'
                  ? 'bg-white shadow-sm text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Players ({players.length})
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-2 px-3 rounded-md font-medium text-sm transition ${
                activeTab === 'teams'
                  ? 'bg-white shadow-sm text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Teams ({teams.length})
            </button>
          </div>

          <div className="flex gap-2">
            {activeTab === 'players' && (
              <button
                onClick={() => setShowAddPlayer(true)}
                className="btn btn-primary"
              >
                + Add Player
              </button>
            )}
            {activeTab === 'teams' && (
              <button
                onClick={() => setShowAddTeam(true)}
                className="btn btn-primary"
              >
                + Add Team
              </button>
            )}
          </div>
          {/* Random picker is useful while viewing players */}
          {activeTab === 'players' && (
            <div className="ml-4">
              <RandomPlayerPicker
                players={players}
                onPick={(player) => {
                  // open the auction modal for the picked player
                  setSelectedPlayer(player);
                }}
              />
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
