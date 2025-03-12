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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Game details data
  const gameDetails = {
    'Chess': {
      description: 'A classic strategy board game played on an 8x8 grid. Players control an army of pieces with different movement patterns, trying to checkmate the opponent\'s king.',
      recommendedAge: '8+',
      playerCount: '2'
    },
    'Monopoly': {
      description: 'A popular family board game where players buy, sell, and trade properties to build monopolies and collect rent from opponents.',
      recommendedAge: '8+',
      playerCount: '2-8'
    },
    'Catan': {
      description: 'A modern classic strategy game where players collect resources to build settlements, cities, and roads to earn victory points.',
      recommendedAge: '10+',
      playerCount: '3-4'
    },
    'Scrabble': {
      description: 'A word game where players score points by forming words with letter tiles on a 15x15 grid board.',
      recommendedAge: '8+',
      playerCount: '2-4'
    },
    'Risk': {
      description: 'A strategy board game focused on diplomacy, conflict and conquest. Players aim to conquer territories across a world map.',
      recommendedAge: '10+',
      playerCount: '2-6'
    },
    'Pandemic': {
      description: 'A cooperative game where players work together as disease-fighting specialists to treat infections and find cures for diseases.',
      recommendedAge: '8+',
      playerCount: '2-4'
    },
    'Ticket to Ride': {
      description: 'A cross-country train adventure where players collect cards to claim railway routes connecting cities throughout North America.',
      recommendedAge: '8+',
      playerCount: '2-5'
    },
    'Carcassonne': {
      description: 'A tile-placement game where players develop the landscape of a medieval fortress city one tile at a time.',
      recommendedAge: '7+',
      playerCount: '2-5'
    },
    'Codenames': {
      description: 'A social word game where teams compete to identify their agents from codenames on the table while avoiding the assassin.',
      recommendedAge: '14+',
      playerCount: '2-8+'
    },
    'Dominion': {
      description: 'A deck-building card game where players start with small decks and acquire new cards to build more effective decks.',
      recommendedAge: '13+',
      playerCount: '2-4'
    },
    'Azul': {
      description: 'An abstract strategy game where players collect colored tiles to decorate the walls of a royal palace.',
      recommendedAge: '8+',
      playerCount: '2-4'
    },
    '7 Wonders': {
      description: 'A card drafting game where players develop their ancient civilizations through three ages to achieve military, scientific, and cultural dominance.',
      recommendedAge: '10+',
      playerCount: '3-7'
    },
    'Splendor': {
      description: 'A card development game where players take on the role of Renaissance merchants trying to build prestige through gem acquisition.',
      recommendedAge: '10+',
      playerCount: '2-4'
    },
    'Dixit': {
      description: 'A creative and imaginative party game using cards with dreamlike images where players try to guess which image matches a clue.',
      recommendedAge: '8+',
      playerCount: '3-6'
    }
  };

  // Load games and history from localStorage on component mount
  useEffect(() => {
    try {
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
          { id: '4', name: 'Risk', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '5', name: 'Pandemic', category: 'Cooperative', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '6', name: 'Ticket to Ride', category: 'Family', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '7', name: 'Carcassonne', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '8', name: 'Codenames', category: 'Party', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '9', name: 'Dominion', category: 'Card', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '10', name: 'Azul', category: 'Abstract', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '11', name: '7 Wonders', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '12', name: 'Splendor', category: 'Card', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
          { id: '13', name: 'Dixit', category: 'Party', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null }
        ];
        
        setGames(defaultGames);
        localStorage.setItem('games', JSON.stringify(defaultGames));
      }
      
      if (savedHistory) {
        setGameHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // Set default games if there's an error
      const defaultGames = [
        { id: '0', name: 'Chess', category: 'Strategy', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null },
        { id: '1', name: 'Monopoly', category: 'Family', status: 'Available', table: '-', players: '-', timeInUse: '-', startTime: null }
        // More default games can be added here if needed
      ];
      setGames(defaultGames);
    }
  }, []);

  // Save games to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('games', JSON.stringify(games));
    } catch (error) {
      console.error("Error saving games to localStorage:", error);
    }
  }, [games]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    } catch (error) {
      console.error("Error saving history to localStorage:", error);
    }
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

  const markAsUnavailable = (gameId) => {
    if (!tableNumber || !playerCount) {
      alert('Please enter table number and player count before marking game as unavailable');
      return;
    }

    const currentTime = new Date();
    
    setGames(games.map(game => {
      if (game.id === gameId) {
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
    setSelectedGame(game);
    setShowDetailsModal(true);
  };
  
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedGame(null);
  };

  // Filter games based on category selection
  const filteredGames = categoryFilter === 'All' 
    ? games 
    : games.filter(game => game.category === categoryFilter);

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(games.map(game => game.category))];

  return (
    <div className="dashboard-container">
      <div className="logo-container">
        <img 
          src="/images/spilcafe_logo.png" 
          alt="Spilcafeen Logo" 
          className="logo"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM1NTUiIGZvbnQtc2l6ZT0iMTYiPkxvZ288L3RleHQ+PC9zdmc+';
          }}
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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
                        Mark as Available
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
      
      {/* Details Modal */}
      {showDetailsModal && selectedGame && (
        <div className="details-modal-overlay">
          <div className="details-modal">
            <div className="details-modal-header">
              <h2>{selectedGame.name} Details</h2>
              <button className="close-button" onClick={closeDetailsModal}>×</button>
            </div>
            <div className="details-modal-content">
              <div className="game-details-card">
                <div className="game-details-row">
                  <div className="game-details-label">Category:</div>
                  <div className="game-details-value">
                    <span className={`category-badge ${selectedGame.category.toLowerCase()}`}>
                      {selectedGame.category}
                    </span>
                  </div>
                </div>
                
                <div className="game-details-row">
                  <div className="game-details-label">Description:</div>
                  <div className="game-details-value">
                    {gameDetails[selectedGame.name]?.description || 'No description available.'}
                  </div>
                </div>
                
                <div className="game-details-row">
                  <div className="game-details-label">Recommended Age:</div>
                  <div className="game-details-value">
                    {gameDetails[selectedGame.name]?.recommendedAge || 'N/A'}
                  </div>
                </div>
                
                <div className="game-details-row">
                  <div className="game-details-label">Player Count:</div>
                  <div className="game-details-value">
                    {gameDetails[selectedGame.name]?.playerCount || 'N/A'}
                  </div>
                </div>
                
                <div className="game-details-row">
                  <div className="game-details-label">Current Status:</div>
                  <div className="game-details-value">
                    <span className={`status-badge ${selectedGame.status.toLowerCase().replace(' ', '-')}`}>
                      {selectedGame.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
