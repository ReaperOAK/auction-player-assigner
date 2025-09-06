import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAuctionPDF = (players, teams) => {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Set up document properties
  doc.setProperties({
    title: 'RSTC 4.0 Auction Results',
    subject: 'Football Tournament Auction Summary',
    author: 'Auction Dashboard',
    creator: 'Auction Management System'
  });

  // Colors and styling
  const primaryColor = '#1e40af'; // Blue
  const secondaryColor = '#374151'; // Gray
  const accentColor = '#10b981'; // Green
  const dangerColor = '#ef4444'; // Red

  // Helper function to add header
  const addHeader = (title, subtitle = '') => {
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, 12, { align: 'center' });
    
    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 105, 18, { align: 'center' });
    }
    
    doc.setTextColor(0, 0, 0);
    return 30; // Return Y position after header
  };

  // Helper function to add footer
  const addFooter = (pageNum, totalPages) => {
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${currentDate}`, 20, 287);
    doc.text(`Page ${pageNum} of ${totalPages}`, 190, 287, { align: 'right' });
  };

  // Calculate statistics
  const totalPlayers = players.length;
  const soldPlayers = players.filter(p => p.soldTo).length;
  const unsoldPlayers = totalPlayers - soldPlayers;
  const totalSpent = teams.reduce((sum, team) => sum + team.spent, 0);
  const averagePrice = soldPlayers > 0 ? (totalSpent / soldPlayers).toFixed(2) : 0;

  // Gender breakdown
  const malePlayersSold = players.filter(p => p.gender === 'male' && p.soldTo).length;
  const femalePlayersSold = players.filter(p => p.gender === 'female' && p.soldTo).length;
  const malePlayers = players.filter(p => p.gender === 'male').length;
  const femalePlayers = players.filter(p => p.gender === 'female').length;

  // Position breakdown
  const positionStats = ['GK', 'DEF', 'MID', 'ATT'].map(pos => ({
    position: pos,
    total: players.filter(p => p.position === pos).length,
    sold: players.filter(p => p.position === pos && p.soldTo).length
  }));

  // Page 1: Summary & Statistics
  let yPos = addHeader('RSTC 4.0 AUCTION RESULTS', `Tournament Summary - ${currentDate}`);
  
  // Auction Overview Box
  doc.setFillColor(248, 250, 252);
  doc.rect(20, yPos, 170, 50, 'F');
  doc.setDrawColor(primaryColor);
  doc.rect(20, yPos, 170, 50, 'S');
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('AUCTION OVERVIEW', 105, yPos + 10, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor);
  
  const overviewData = [
    [`Total Players: ${totalPlayers}`, `Players Sold: ${soldPlayers}`],
    [`Players Unsold: ${unsoldPlayers}`, `Total Amount Spent: ${totalSpent} points`],
    [`Average Price: ${averagePrice} points`, `Teams: ${teams.length}`]
  ];
  
  let overviewY = yPos + 20;
  overviewData.forEach(row => {
    doc.text(row[0], 30, overviewY);
    doc.text(row[1], 110, overviewY);
    overviewY += 8;
  });
  
  yPos += 65;

  // Gender & Position Statistics
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('PLAYER STATISTICS', 20, yPos);
  
  yPos += 15;
  
  // Gender stats table - SIMPLIFIED
  const genderHeaders = ['Category', 'Total', 'Sold', 'Unsold', 'Sold %'];
  const genderData = [
    ['Male Players', malePlayers, malePlayersSold, malePlayers - malePlayersSold, `${((malePlayersSold/malePlayers)*100).toFixed(1)}%`],
    ['Female Players', femalePlayers, femalePlayersSold, femalePlayers - femalePlayersSold, `${((femalePlayersSold/femalePlayers)*100).toFixed(1)}%`]
  ];

  autoTable(doc, {
    startY: yPos,
    head: [genderHeaders],
    body: genderData,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
    tableWidth: 'auto'
  });

  yPos = doc.lastAutoTable.finalY + 20;

  // Position stats table - SIMPLIFIED
  const positionHeaders = ['Position', 'Total', 'Sold', 'Unsold', 'Sold %'];
  const positionData = positionStats.map(stat => [
    stat.position,
    stat.total,
    stat.sold,
    stat.total - stat.sold,
    `${((stat.sold/stat.total)*100).toFixed(1)}%`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [positionHeaders],
    body: positionData,
    theme: 'grid',
    headStyles: { fillColor: accentColor, textColor: 255, fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
    tableWidth: 'auto'
  });

  // Page 2: Team Summary - SIMPLIFIED
  doc.addPage();
  yPos = addHeader('TEAM SUMMARY', 'Squad Composition & Budget Analysis');

  const teamData = teams.map(team => {
    const teamPlayers = players.filter(p => p.soldTo == team.id);
    return [
      team.name,
      teamPlayers.length,
      `${team.spent} points`,
      `${team.budget - team.spent} points`
    ];
  });

  const teamHeaders = ['Team', 'Players', 'Spent', 'Remaining'];

  autoTable(doc, {
    startY: yPos,
    head: [teamHeaders],
    body: teamData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
    tableWidth: 'auto'
  });

  // Page 3: All Players List - SIMPLIFIED
  doc.addPage();
  yPos = addHeader('COMPLETE PLAYER LIST', 'All Registered Players with Auction Status');

  const playerHeaders = ['Name', 'Graduation Year', 'Position', 'Team'];
  const playerData = players
    .sort((a, b) => {
      // Handle null/undefined soldTo values
      const aSoldTo = a.soldTo;
      const bSoldTo = b.soldTo;
      
      if (aSoldTo && !bSoldTo) return -1;
      if (!aSoldTo && bSoldTo) return 1;
      if (aSoldTo && bSoldTo && typeof aSoldTo === 'string' && typeof bSoldTo === 'string') {
        return aSoldTo.localeCompare(bSoldTo);
      }
      return a.name.localeCompare(b.name);
    })
    .map(player => {
      // Convert team ID to team name
      const team = teams.find(t => t.id == player.soldTo);
      const teamName = team ? team.name : 'UNSOLD';
      
      return [
        player.name,
        player.year,
        player.position,
        teamName
      ];
    });

  autoTable(doc, {
    startY: yPos,
    head: [playerHeaders],
    body: playerData,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 20, right: 20 },
    tableWidth: 'auto'
  });

  // Page 4+: Team Rosters - DETAILED INFORMATION
  // Show ALL teams, not just ones with players
  teams.forEach((team, index) => {
    // Match by team ID with type conversion
    const playersForThisTeam = players.filter(p => p.soldTo == team.id);
    const teamPlayers = playersForThisTeam;
    
    // Add new page for each team
    doc.addPage();
    yPos = addHeader('TEAM ROSTER', `${team.name} Squad`);

    // Team info with total spent
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text(`${team.name} - ${teamPlayers.length} Players - Total Spent: ${team.spent} points`, 20, yPos);

    yPos += 20;

    if (teamPlayers.length === 0) {
      // Show "No players assigned" message
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(dangerColor);
      doc.text('No players assigned to this team yet.', 20, yPos);
    } else {
      // Enhanced table with more details
      const teamPlayerHeaders = ['Player Name', 'Graduation Year', 'Position', 'Price', 'Department'];
      const teamPlayerData = teamPlayers
        .sort((a, b) => {
          // Sort by position first (GK, DEF, MID, ATT), then by name
          const positionOrder = { 'GK': 1, 'DEF': 2, 'MID': 3, 'ATT': 4 };
          const aPos = positionOrder[a.position] || 5;
          const bPos = positionOrder[b.position] || 5;
          if (aPos !== bPos) return aPos - bPos;
          return a.name.localeCompare(b.name);
        })
        .map(player => [
          player.name,
          player.year,
          player.position,
          `${player.price || 0} points`,
          player.department || 'N/A'
        ]);

      autoTable(doc, {
        startY: yPos,
        head: [teamPlayerHeaders],
        body: teamPlayerData,
        theme: 'striped',
        headStyles: { fillColor: accentColor, textColor: 255, fontSize: 11 },
        bodyStyles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 60, halign: 'left' },   // Player Name
          1: { cellWidth: 20, halign: 'center' }, // Graduation Year
          2: { cellWidth: 25, halign: 'center' }, // Position
          3: { cellWidth: 25, halign: 'center' }, // Price
          4: { cellWidth: 30, halign: 'center' }  // Department
        },
        margin: { left: 20, right: 20 },
        tableWidth: 'auto',
        didParseCell: function(data) {
          // Highlight goalkeepers
          if (data.column.index === 2 && data.cell.text[0] === 'GK') {
            data.cell.styles.textColor = primaryColor;
            data.cell.styles.fontStyle = 'bold';
          }
          // Highlight high-value players (over 30 points)
          if (data.column.index === 3 && data.cell.text[0]) {
            const price = parseInt(data.cell.text[0].replace('$', ''));
            if (price > 30) {
              data.cell.styles.textColor = dangerColor;
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });

      // Add team summary below the table
      yPos = doc.lastAutoTable.finalY + 15;
      
      // Team composition summary
      const gkCount = teamPlayers.filter(p => p.position === 'GK').length;
      const defCount = teamPlayers.filter(p => p.position === 'DEF').length;
      const midCount = teamPlayers.filter(p => p.position === 'MID').length;
      const attCount = teamPlayers.filter(p => p.position === 'ATT').length;
      const maleCount = teamPlayers.filter(p => p.gender === 'male').length;
      const femaleCount = teamPlayers.filter(p => p.gender === 'female').length;
      const avgPrice = teamPlayers.length > 0 ? (team.spent / teamPlayers.length).toFixed(1) : 0;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(secondaryColor);
      
      const summaryText = [
        `Squad Composition: ${gkCount} GK, ${defCount} DEF, ${midCount} MID, ${attCount} ATT`,
        `Gender Split: ${maleCount} Male, ${femaleCount} Female`,
        `Budget: ${team.spent} points out of ${team.budget} (${((team.spent/team.budget)*100).toFixed(1)}% used)`,
        ` spent of ${team.budget} (${((team.spent/team.budget)*100).toFixed(1)}% used)`,
        `Average Price: ${avgPrice} points per player | Remaining Budget: ${team.budget - team.spent} points`
      ];

      summaryText.forEach((text, index) => {
        doc.text(text, 20, yPos + (index * 8));
      });
    }
  });

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Save the PDF
  const fileName = `RSTC-4.0-Auction-Results-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
