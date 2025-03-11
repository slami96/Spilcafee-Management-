import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import './Dashboard.css';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [totalActivePlayers, setTotalActivePlayers] = useState(0);

  const auth = getAuth();

  useEffect(() => {
    // Initialize with default games instead of loading from Firebase
    console.log('Initializing default games');
    const defaultGames = [
      { id: '0', name: 'Chess', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-' },
      { id: '1', name: 'Monopoly', category: 'Family', status: 'Available', table: '-', players: '-', timeInUse: '-' },
      { id: '2', name: 'Catan', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-' },
      { id: '3', name: 'Scrabble', category: 'Word', status: 'Available', table: '-', players: '-', timeInUse: '-' },
      { id: '4', name: 'Risk', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-' }
    ];
    
    setGames(defaultGames);
  }, []);

  // Calculate total active players whenever games change
  useEffect(() => {
    const activeGames = games.filter(game => 
      game.status === 'In Use' && game.players && game.players !== '-'
    );
    
    const totalPlayers = activeGames.reduce((sum, game) => 
      sum + (parseInt(game.players) || 0), 0
    );
    
    setTotalActivePlayers(totalPlayers);
  }, [games]);

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

    setGames(games.map(game => {
      if (game.id === gameToAssign.id) {
        return {
          ...game,
          status: 'In Use',
          table: tableNumber,
          players: playerCount,
          timeInUse: timestamp
        };
      }
      return game;
    }));

    setTableNumber('');
    setPlayerCount('');
  };

  const markAsUnavailable = (gameId) => {
    setGames(games.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          status: 'Unavailable'
        };
      }
      return game;
    }));
  };

  const markAsAvailable = (gameId) => {
    setGames(games.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          status: 'Available',
          table: '-',
          players: '-',
          timeInUse: '-'
        };
      }
      return game;
    }));
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
        <img 
          src="/logo.png" 
          alt="Spilcafeen Logo" 
          className="logo"
        />
      </div>
      
      <div className="header">
        <h1>Game Management System</h1>
      </div>
      
      <div className="main-content">
        <h2>Select the table with players and assign the game</h2>
        
        <div className="controls">
          <div className="control-group">
            <label htmlFor="tableNumber">Table Number:</label>
            <input 
              id="tableNumber"
              type="text" 
              placeholder="Enter table #" 
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label htmlFor="playerCount">Number of Players:</label>
            <input 
              id="playerCount"
              type="text" 
              placeholder="Enter player count" 
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label htmlFor="categorySelect">Filter by Category:</label>
            <select 
              id="categorySelect"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Strategy">Strategy</option>
              <option value="Family">Family</option>
              <option value="Word">Word</option>
            </select>
          </div>
          
          <div className="control-group">
            <button className="assign-button" onClick={assignGame}>
              Assign Game
            </button>
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
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-games">No games available. They will appear here once loaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
