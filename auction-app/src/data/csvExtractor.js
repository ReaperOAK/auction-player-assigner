// CSV Data Extraction Script
// This script processes the RSTC 4.0 CSV data and converts it to the auction app format

// Helper function to determine position mapping
const mapPosition = (csvPosition) => {
  if (!csvPosition) return 'MID'; // Default
  
  const pos = csvPosition.toLowerCase();
  if (pos.includes('goalkeeper') || pos.includes('keeper')) return 'GK';
  if (pos.includes('defender') || pos.includes('defence')) return 'DEF';
  if (pos.includes('midfielder') || pos.includes('midfield')) return 'MID';
  if (pos.includes('forward') || pos.includes('attacker') || pos.includes('striker')) return 'ATT';
  
  return 'MID'; // Default fallback
};

// Helper function to determine year/batch
const mapYear = (csvYear) => {
  if (!csvYear) return '2023';
  
  const year = csvYear.toLowerCase();
  if (year.includes('2025') || year.includes('1st') || year.includes('first')) return '2025';
  if (year.includes('2024') || year.includes('2nd') || year.includes('second')) return '2024';
  if (year.includes('2023') || year.includes('3rd') || year.includes('third')) return '2023';
  if (year.includes('2022') || year.includes('4th') || year.includes('fourth')) return '2022';
  if (year.includes('2021') || year.includes('5th') || year.includes('fifth')) return '2021';
  
  return '2023'; // Default
};

// Helper function to determine gender
const mapGender = (role) => {
  if (!role) return 'male';
  return role.toLowerCase().includes('female') ? 'female' : 'male';
};

// Robust string -> boolean parser for fields like 'Yes', 'No', 'True', 'False', '1', '0'
const stringToBool = (val) => {
  if (val === undefined || val === null) return false;
  const s = String(val).trim().toLowerCase();
  if (s === 'yes' || s === 'y' || s === 'true' || s === '1' || s === 't') return true;
  return false;
};

// Extract data from CSV rows
export const extractPlayersFromCSV = (csvText) => {
  const lines = csvText.split('\n');
  const players = [];
  let id = 1;

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      // Parse CSV line (handling quoted fields)
      const fields = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim()); // Add last field

      // Extract relevant fields based on CSV structure
      const timestamp = fields[0] || '';
      const email = fields[1] || '';
      const name = fields[2] || '';
      const role = fields[3] || '';
      
      // For male players
      const maleName = fields[4] || '';
      const maleDept = fields[5] || '';
      const malePosition = fields[6] || '';
      const maleYear = fields[8] || '';
      
      // For female players 
      const femaleName = fields[11] || '';
      const femaleDept = fields[12] || '';
      const femalePosition = fields[13] || '';
      const femaleYear = fields[14] || '';

      // Skip managers and empty rows
      if (role.toLowerCase().includes('manager') || (!maleName && !femaleName)) {
        continue;
      }

      let playerData;
      
    if (role.toLowerCase().includes('female') && femaleName) {
        // Female player
        playerData = {
          id: id++,
          name: femaleName.replace(/"/g, '').trim(),
          year: mapYear(femaleYear),
          position: mapPosition(femalePosition),
      // CSV has a shared "Are you the part of Departmental team?" column at index 7
      prevTournament: stringToBool(fields[7]),
          gender: 'female',
          department: femaleDept.replace(/"/g, '').trim(),
          soldTo: null,
          price: 0
        };
      } else if (role.toLowerCase().includes('male') && maleName) {
        // Male player
        playerData = {
          id: id++,
          name: maleName.replace(/"/g, '').trim(),
          year: mapYear(maleYear),
          position: mapPosition(malePosition),
      prevTournament: stringToBool(fields[7]),
          gender: 'male',
          department: maleDept.replace(/"/g, '').trim(),
          soldTo: null,
          price: 0
        };
      }

      if (playerData && playerData.name) {
        players.push(playerData);
      }

    } catch (error) {
      console.log(`Error parsing line ${i}: ${error.message}`);
      continue;
    }
  }

  return players;
};

// Manual extraction of the CSV data
export const extractedPlayers = [
  // Male Players
  { id: 1, name: "Eman Haldar", year: "2023", position: "DEF", prevTournament: false, gender: "male", department: "EE", soldTo: null, price: 0 },
  { id: 2, name: "Sayanavo Bhattacherjee", year: "2022", position: "MID", prevTournament: false, gender: "male", department: "EE", soldTo: null, price: 0 },
  { id: 3, name: "MD REHAB JAMAL", year: "2024", position: "MID", prevTournament: false, gender: "male", department: "IT", soldTo: null, price: 0 },
  { id: 4, name: "Arafat Khan", year: "2022", position: "GK", prevTournament: false, gender: "male", department: "EE", soldTo: null, price: 0 },
  { id: 5, name: "Souvik Das", year: "2024", position: "ATT", prevTournament: false, gender: "male", department: "ECE", soldTo: null, price: 0 },
  { id: 6, name: "Barshan Roy", year: "2022", position: "ATT", prevTournament: false, gender: "male", department: "ECE", soldTo: null, price: 0 },
  { id: 7, name: "Ahbab Khan", year: "2023", position: "ATT", prevTournament: false, gender: "male", department: "IT", soldTo: null, price: 0 },
  { id: 8, name: "Rishav Das", year: "2023", position: "DEF", prevTournament: false, gender: "male", department: "EE", soldTo: null, price: 0 },
  { id: 9, name: "Rajdeep Barik", year: "2025", position: "DEF", prevTournament: false, gender: "male", department: "ECE", soldTo: null, price: 0 },
  { id: 10, name: "Sristinil Biswas", year: "2022", position: "ATT", prevTournament: false, gender: "male", department: "IT", soldTo: null, price: 0 },
  { id: 11, name: "Aryan Agarwal", year: "2023", position: "MID", prevTournament: false, gender: "male", department: "CSE", soldTo: null, price: 0 },
  { id: 12, name: "Gauhar Akram", year: "2023", position: "MID", prevTournament: false, gender: "male", department: "CSE", soldTo: null, price: 0 },
  { id: 13, name: "Adil Nawaz Alam", year: "2023", position: "MID", prevTournament: false, gender: "male", department: "AIML", soldTo: null, price: 0 },
  { id: 14, name: "Akash Hajra", year: "2022", position: "ATT", prevTournament: false, gender: "male", department: "IT", soldTo: null, price: 0 },
  { id: 15, name: "Shouvik Sur", year: "2023", position: "MID", prevTournament: false, gender: "male", department: "IT", soldTo: null, price: 0 },
  { id: 16, name: "Chetan Singh", year: "2024", position: "GK", prevTournament: false, gender: "male", department: "EE", soldTo: null, price: 0 },
  { id: 17, name: "Arunava Deb", year: "2024", position: "DEF", prevTournament: false, gender: "male", department: "ECE", soldTo: null, price: 0 },
  { id: 18, name: "Md Sarim Jamal", year: "2024", position: "ATT", prevTournament: false, gender: "male", department: "AIML", soldTo: null, price: 0 },
  { id: 19, name: "Aritra Paul", year: "2023", position: "DEF", prevTournament: false, gender: "male", department: "ECE", soldTo: null, price: 0 },
  { id: 20, name: "Abhisheek Singh", year: "2023", position: "GK", prevTournament: false, gender: "male", department: "EE", soldTo: null, price: 0 },
  { id: 21, name: "Mohammad Mubashir", year: "2023", position: "DEF", prevTournament: false, gender: "male", department: "IT", soldTo: null, price: 0 },
  { id: 22, name: "Arijit Das", year: "2024", position: "MID", prevTournament: false, gender: "male", department: "ECE", soldTo: null, price: 0 },
  { id: 23, name: "MD ZAYEEM", year: "2024", position: "ATT", prevTournament: false, gender: "male", department: "AIML", soldTo: null, price: 0 },
  { id: 24, name: "Arnab Das", year: "2024", position: "DEF", prevTournament: false, gender: "male", department: "AIML", soldTo: null, price: 0 },
  { id: 25, name: "Sayak Hajra", year: "2025", position: "GK", prevTournament: false, gender: "male", department: "CSE", soldTo: null, price: 0 },
  { id: 26, name: "Mohammad Iftikhar", year: "2024", position: "ATT", prevTournament: false, gender: "male", department: "CSE", soldTo: null, price: 0 },
  { id: 27, name: "Swapnil Mukherjee", year: "2024", position: "DEF", prevTournament: false, gender: "male", department: "AIML", soldTo: null, price: 0 },
  { id: 28, name: "Agniva Acherjee", year: "2022", position: "MID", prevTournament: false, gender: "male", department: "IT", soldTo: null, price: 0 },
  { id: 29, name: "Adil", year: "2025", position: "GK", prevTournament: false, gender: "male", department: "IT", soldTo: null, price: 0 },
  { id: 30, name: "Jeet Mondal", year: "2024", position: "ATT", prevTournament: false, gender: "male", department: "AIML", soldTo: null, price: 0 },
  
  // Female Players
  { id: 50, name: "Chirasree Roy", year: "2023", position: "ATT", prevTournament: false, gender: "female", department: "ECE", soldTo: null, price: 0 },
  { id: 51, name: "Abhilasha Pandey", year: "2024", position: "DEF", prevTournament: false, gender: "female", department: "CSE", soldTo: null, price: 0 },
  { id: 52, name: "Sampriti Mandal", year: "2024", position: "MID", prevTournament: false, gender: "female", department: "CSE", soldTo: null, price: 0 },
  { id: 53, name: "Asmita Singh", year: "2024", position: "GK", prevTournament: false, gender: "female", department: "IT", soldTo: null, price: 0 },
  { id: 54, name: "Anusha Khan", year: "2024", position: "DEF", prevTournament: false, gender: "female", department: "CSE", soldTo: null, price: 0 },
  { id: 55, name: "Aditi Das", year: "2023", position: "DEF", prevTournament: false, gender: "female", department: "CSE", soldTo: null, price: 0 },
  { id: 56, name: "Ushasi Giri", year: "2023", position: "DEF", prevTournament: false, gender: "female", department: "CSE", soldTo: null, price: 0 }
];

export default extractedPlayers;
