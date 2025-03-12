import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [totalActivePlayers, setTotalActivePlayers] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [timers, setTimers] = useState({});

  // Load games and history from localStorage on component mount
  useEffect(() => {
    const savedGames = localStorage.getItem('games');
    const savedHistory = localStorage.getItem('gameHistory');
    
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    } else {
      // Initialize with default games if no saved games exist
      const defaultGames = [
        { id: '0', name: 'Chess', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
        { id: '1', name: 'Monopoly', category: 'Family', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
        { id: '2', name: 'Catan', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
        { id: '3', name: 'Scrabble', category: 'Word', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
        { id: '4', name: 'Risk', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null }
      ];
      
      setGames(defaultGames);
      localStorage.setItem('games', JSON.stringify(defaultGames));
    }
    
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
  }, [gameHistory]);

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

  // Timer management - update timers for games in use
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const inUseGames = games.filter(game => game.status === 'In Use' && game.startTime);
      
      if (inUseGames.length > 0) {
        const updatedGames = [...games];
        let needsUpdate = false;
        
        inUseGames.forEach(game => {
          const startTime = new Date(game.startTime);
          const currentTime = new Date();
          const elapsedMilliseconds = currentTime - startTime;
          
          const seconds = Math.floor((elapsedMilliseconds / 1000) % 60);
          const minutes = Math.floor((elapsedMilliseconds / (1000 * 60)) % 60);
          const hours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
          
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          
          const gameIndex = updatedGames.findIndex(g => g.id === game.id);
          if (gameIndex !== -1 && updatedGames[gameIndex].timeInUse !== formattedTime) {
            updatedGames[gameIndex].timeInUse = formattedTime;
            needsUpdate = true;
          }
        });
        
        if (needsUpdate) {
          setGames(updatedGames);
        }
      }
    }, 1000);
    
    return () => clearInterval(timerInterval);
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

    // Assign the first available game that matches the criteria
    const gameToAssign = selectedGames[0];
    const currentTime = new Date();

    setGames(games.map(game => {
      if (game.id === gameToAssign.id) {
        return {
          ...game,
          status: 'In Use',
          table: tableNumber,
          players: playerCount,
          timeInUse: '00:00:00',
          startTime: currentTime.toISOString()
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
    const game = games.find(g => g.id === gameId);
    
    if (game && game.status === 'In Use') {
      // Add to history when ending a game that was in use
      const endTime = new Date();
      const startTime = new Date(game.startTime);
      const duration = game.timeInUse;
      
      const historyEntry = {
        id: Date.now().toString(),
        gameName: game.name,
        table: game.table,
        players: game.players,
        startTime: startTime.toLocaleString(),
        endTime: endTime.toLocaleString(),
        duration: duration
      };
      
      setGameHistory([historyEntry, ...gameHistory]);
    }
    
    setGames(games.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          status: 'Available',
          table: '-',
          players: '-',
          timeInUse: '-',
          startTime: null
        };
      }
      return game;
    }));
  };

  const showHistory = () => {
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
  };

  const deleteHistoryEntry = (historyId) => {
    const updatedHistory = gameHistory.filter(entry => entry.id !== historyId);
    setGameHistory(updatedHistory);
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all game history?')) {
      setGameHistory([]);
    }
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
          src="/images/spilcafe_logo.png" 
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
      
      {/* History Modal */}
      {showHistoryModal && (
        <div className="history-modal-overlay">
          <div className="history-modal">
            <div className="history-modal-header">
              <h2>Game History</h2>
              <button className="close-button" onClick={closeHistoryModal}>×</button>
            </div>
            <div className="history-modal-content">
              {gameHistory.length > 0 ? (
                <>
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Game</th>
                        <th>Table</th>
                        <th>Players</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameHistory.map(entry => (
                        <tr key={entry.id}>
                          <td>{entry.gameName}</td>
                          <td>{entry.table}</td>
                          <td>{entry.players}</td>
                          <td>{entry.startTime}</td>
                          <td>{entry.endTime}</td>
                          <td>{entry.duration}</td>
                          <td>
                            <button 
                              className="delete-button"
                              onClick={() => deleteHistoryEntry(entry.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="clear-history">
                    <button 
                      className="clear-history-button"
                      onClick={clearAllHistory}
                    >
                      Clear All History
                    </button>
                  </div>
                </>
              ) : (
                <p className="no-history">No game history available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
