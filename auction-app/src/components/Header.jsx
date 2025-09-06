import React from 'react';
import { IconTrophy } from './Icons';

const Header = ({ totalPlayersAssigned, totalPlayers, totalSpent, onImportCSV, onExportPDF, onReset }) => {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-sm">
      <a href="#maincontent" className="sr-only focus:not-sr-only block px-4 py-2">Skip to main</a>
      <div className="container mx-auto flex items-center justify-between py-5">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-md p-2">
            <IconTrophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Auction Dashboard</h1>
            <p className="text-sm opacity-90">{totalPlayersAssigned}/{totalPlayers} assigned • {totalSpent} points spent</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onImportCSV} className="btn btn-ghost text-white/90">Import CSV</button>
          <button onClick={onExportPDF} className="btn btn-primary">Export PDF</button>
          <button onClick={onReset} className="btn bg-red-600 hover:bg-red-700 text-white">Reset</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
