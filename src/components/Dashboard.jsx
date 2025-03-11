import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [totalActivePlayers, setTotalActivePlayers] = useState(0);

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    // Load games from Firebase
    const gamesRef = ref(db, 'games');
    
    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const gamesArray = Object.entries(data).map(([id, game]) => ({
          id,
          ...game
        }));
        setGames(gamesArray);
        
        // Calculate total active players
        const activeGames = gamesArray.filter(game => 
          game.status === 'In Use' && game.players && game.players > 0
        );
        
        const totalPlayers = activeGames.reduce((sum, game) => 
          sum + (parseInt(game.players) || 0), 0
        );
        
        setTotalActivePlayers(totalPlayers);
      } else {
        // If no games exist in the database, initialize with default games
        initializeDefaultGames();
      }
    });
  }, [db]);

  const initializeDefaultGames = () => {
    const defaultGames = [
      { name: 'Chess', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-' },
      { name: 'Monopoly', category: 'Family', status: 'Available', table: '-', players: '-', timeInUse: '-' },
      { name: 'Catan', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-' },
      { name: 'Scrabble', category: 'Word', status: 'Available', table: '-', players: '-', timeInUse: '-' },
      { name: 'Risk', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-' }
    ];
    
    defaultGames.forEach((game, index) => {
      set(ref(db, `games/${index}`), game);
    });
  };

  const assignGame = () => {
    if (!tableNumber || !playerCount) {
      alert('Please enter table number and player count');
      return;
    }

    const selectedGames = games.filter(game => 
      game.status === 'Available' && 
      (categoryFilter === 'All' || game.category === categoryFilter)
    );

    if (selectedGames.length === 0) {
      alert('No available games match your criteria');
      return;
    }

    // For simplicity, assign the first available game that matches the criteria
    const gameToAssign = selectedGames[0];
    const timestamp = new Date().toLocaleTimeString();

    update(ref(db, `games/${gameToAssign.id}`), {
      status: 'In Use',
      table: tableNumber,
      players: playerCount,
      timeInUse: timestamp
    });

    setTableNumber('');
    setPlayerCount('');
  };

  const markAsUnavailable = (gameId) => {
    update(ref(db, `games/${gameId}`), {
      status: 'Unavailable'
    });
  };

  const markAsAvailable = (gameId) => {
    update(ref(db, `games/${gameId}`), {
      status: 'Available',
      table: '-',
      players: '-',
      timeInUse: '-'
    });
  };

  const showHistory = () => {
    alert('Game history feature coming soon!');
  };

  const viewDetails = (game) => {
    alert(`Game Details:\nName: ${game.name}\nCategory: ${game.category}\nStatus: ${game.status}`);
  };

  // Filter games based on category selection
  const filteredGames = categoryFilter === 'All' 
    ? games 
    : games.filter(game => game.category === categoryFilter);

  return (
    <div className="dashboard-container">
      <div className="logo-container">
        {/* Logo image would go here */}
      </div>
      
      <div className="header">
        <h1>Game Management System</h1>
      </div>
      
      <div className="main-content">
        <h2>Select the table with players and assign the game</h2>
        
        <div className="controls">
          <div className="control-group">
            <label>Table Number:</label>
            <input 
              type="text" 
              placeholder="Enter table #" 
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label>Number of Players:</label>
            <input 
              type="text" 
              placeholder="Enter player count" 
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label>Filter by Category:</label>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Strategy">Strategy</option>
              <option value="Family">Family</option>
              <option value="Word">Word</option>
              {/* Add more categories as needed */}
            </select>
          </div>
        </div>
        
        <div className="stats-row">
          <div className="total-players">
            Total Active Players: {totalActivePlayers}
          </div>
          <button className="history-button" onClick={showHistory}>Show History</button>
        </div>
        
        <table className="games-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Category</th>
              <th>Status</th>
              <th>Table</th>
              <th>Players</th>
              <th>Time in Use</th>
              <th>Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game) => (
              <tr key={game.id}>
                <td>{game.name}</td>
                <td>
                  <span className={`category-badge ${game.category.toLowerCase()}`}>
                    {game.category}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${game.status.toLowerCase().replace(' ', '-')}`}>
                    {game.status}
                  </span>
                </td>
                <td>{game.table}</td>
                <td>{game.players}</td>
                <td>{game.timeInUse}</td>
                <td>
                  <button className="info-button" onClick={() => viewDetails(game)}>
                    Details
                  </button>
                </td>
                <td>
                  {game.status === 'Available' ? (
                    <button className="unavailable-button" onClick={() => markAsUnavailable(game.id)}>
                      Mark as Unavailable
                    </button>
                  ) : game.status === 'In Use' ? (
                    <button className="available-button" onClick={() => markAsAvailable(game.id)}>
                      End Game
                    </button>
                  ) : (
                    <button className="available-button" onClick={() => markAsAvailable(game.id)}>
                      Mark as Available
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
