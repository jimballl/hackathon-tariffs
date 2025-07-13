import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import StatsPanel from './components/StatsPanel';
import { countryTradeData, countryBasicInfo } from './data/dummyData';
import './styles/App.css';

// Utility Functions (can be moved to a separate utils.js file)
export const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A';
    const absNum = Math.abs(num);
    if (absNum >= 1000) return `${(num / 1000).toFixed(1)}B`;
    return `${num.toFixed(1)}M`;
};

export const formatPopulation = (pop) => {
    if (!pop || isNaN(pop)) return 'N/A';
    if (pop >= 1000000000) return `${(pop / 1000000000).toFixed(2)} billion`;
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)} million`;
    return pop.toString();
};

const App = () => {
    const [tradeData, setTradeData] = useState({});
    const [worldData, setWorldData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Process dummy data on initial load
        const processedData = {};
        countryTradeData.forEach(row => {
            processedData[row.Country] = {
                deficit2024: row['US 2024 Deficit'],
                exports2024: row['US 2024 Exports'],
                imports2024: row['US 2024 Imports (Customs Basis)'],
                trumpTariffs: row['Trump Tariffs Alleged'],
                trumpResponse: row['Trump Response'],
                population: row['Population']
            };
        });
        setTradeData(processedData);

        // Fetch map data
        fetch('/world.geojson')
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                setWorldData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch world map data:", err);
                setError("Could not load map data. Please ensure world.geojson is in the public folder and check your internet connection.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading">🔄 Loading map and trade data...</div>;
    }

    if (error) {
        return <div className="error">❌ {error}</div>;
    }

    return (
        <div className="container">
            <h1>🌍 US Trade Relations Interactive Map 2024</h1>
            <StatsPanel tradeData={tradeData} />
            <Map 
                worldData={worldData} 
                tradeData={tradeData} 
                basicInfo={countryBasicInfo} 
            />
             <div className="info-panel">
                 <div className="legend">
                    <div className="legend-section">
                        <strong>🎨 Trade Balance Colors:</strong>
                        <div className="legend-item"><div className="legend-color" style={{ background: '#27ae60' }}></div><span>Trade Surplus</span></div>
                        <div className="legend-item"><div className="legend-color" style={{ background: '#e74c3c' }}></div><span>Trade Deficit</span></div>
                        <div className="legend-item"><div className="legend-color" style={{ background: '#3498db' }}></div><span>Low Trade Volume</span></div>
                        <div className="legend-item"><div className="legend-color" style={{ background: '#bdc3c7' }}></div><span>No Data</span></div>
                    </div>
                     <div className="legend-section">
                        <strong>📊 Data Points:</strong>
                        <p>US 2024 Trade Deficit/Surplus</p>
                        <p>Trump Tariffs & Responses</p>
                        <p>Country Population</p>
                    </div>
                </div>
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    <strong>🎯 Hover over a country to see its detailed trade profile!</strong>
                </p>
            </div>
        </div>
    );
};

export default App;