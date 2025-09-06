import { useState } from 'react';

const CSVImportModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  // Position mapping from CSV to app format
  const positionMap = {
    'Goalkeeper': 'GK',
    'Defender': 'DEF', 
    'Midfielder': 'MID',
    'Attacker': 'ATT'
  };

  // Year mapping for batch normalization
  const yearMap = {
    '1st': '2025',
    '2nd': '2024', 
    '3rd': '2023',
    '4th': '2022'
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    
    // Parse CSV manually since it has complex quoted structure
    const players = [];
    let idCounter = 1;
    let femaleIdCounter = 101;

    for (let i = 1; i < lines.length; i++) { // Skip header
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Split by comma but handle quoted strings
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim()); // Add last value
      
      if (values.length < 10) continue; // Skip incomplete rows

      // Extract data based on CSV structure
      const role = values[3] || ''; // Role column
      
      // For Male Players
      if (role === 'Male Player') {
        const name = values[4] || ''; // Name (Male Player)
        const department = values[5] || ''; // Department
        const position = values[6] || ''; // Position
        const year = values[8] || ''; // Year
        
        if (!name) continue;
        
        // Parse year - correct mapping based on graduation year  
        let parsedYear = year;
        if (year.includes('4th')) parsedYear = '2026'; // 4th year students graduate in 2025 (so they are batch 2022)
        else if (year.includes('3rd')) parsedYear = '2027'; // 3rd year students graduate in 2026 (batch 2023)
        else if (year.includes('2nd')) parsedYear = '2028'; // 2nd year students graduate in 2027 (batch 2024)  
        else if (year.includes('1st')) parsedYear = '2029'; // 1st year students graduate in 2028 (batch 2025)
        else if (year.includes('Batch 2025')) parsedYear = '2025'; // students graduate in 2025 (batch 2025)
        else if (year.includes('Batch 2024')) parsedYear = '2024'; // students graduate in 2024 (batch 2024)
        else if (year.includes('Batch 2023')) parsedYear = '2023'; // students graduate in 2023 (batch 2023)
        else if (year.includes('Batch 2022')) parsedYear = '2022';

        // Parse position
        let parsedPosition = 'MID';
        if (position.includes('Goalkeeper')) parsedPosition = 'GK';
        else if (position.includes('Defender')) parsedPosition = 'DEF';
        else if (position.includes('Midfielder')) parsedPosition = 'MID';
        else if (position.includes('Forward') || position.includes('Attacker')) parsedPosition = 'ATT';
        
        players.push({
          id: idCounter++,
          name: name,
          year: parsedYear,
          position: parsedPosition,
          prevTournament: false,
          gender: 'male',
          department: department,
          soldTo: null,
          price: 0
        });
      }
      
      // For Female Players
      else if (role === 'Female Player') {
        const name = values[11] || ''; // Name (Female Player)
        const department = values[12] || ''; // Department (Female)
        const position = values[13] || ''; // Position (Female)
        const year = values[14] || ''; // Year (Female)
        
        if (!name) continue;
        
        // Parse year - correct mapping based on graduation year
        let parsedYear = year;
        if (year.includes('4th')) parsedYear = '2022'; // 4th year students graduate in 2025 (so they are batch 2022)
        else if (year.includes('3rd') || year.includes('Batch 2023')) parsedYear = '2023'; // 3rd year students graduate in 2026 (batch 2023)
        else if (year.includes('2nd') || year.includes('Batch 2024')) parsedYear = '2024'; // 2nd year students graduate in 2027 (batch 2024)
        else if (year.includes('1st') || year.includes('Batch 2025')) parsedYear = '2025'; // 1st year students graduate in 2028 (batch 2025)
        
        // Parse position
        let parsedPosition = 'MID';
        if (position.includes('Goalkeeper')) parsedPosition = 'GK';
        else if (position.includes('Defender')) parsedPosition = 'DEF';
        else if (position.includes('MIdfielder') || position.includes('Midfielder')) parsedPosition = 'MID';
        else if (position.includes('Forward') || position.includes('Attacker')) parsedPosition = 'ATT';
        
        players.push({
          id: femaleIdCounter++,
          name: name,
          year: parsedYear,
          position: parsedPosition,
          prevTournament: false,
          gender: 'female',
          department: department,
          soldTo: null,
          price: 0
        });
      }
    }

    return players;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setImporting(true);
    setError('');

    try {
      const text = await file.text();
      const players = parseCSV(text);
      
      if (players.length === 0) {
        throw new Error('No valid player data found in CSV');
      }

      onImport(players);
      setFile(null);
      onClose();
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Import Players from CSV</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={importing}
          />
        </div>

        {file && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              File: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> This will replace all existing player data. 
            Any auction progress (sold players, prices) will be lost.
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Expected format: RSTC registration CSV with Role, Name, Department, Position, Year columns.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={importing}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {importing ? 'Importing...' : 'Import Players'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;
