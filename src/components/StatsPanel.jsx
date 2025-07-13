import React, { useMemo } from 'react';
import { formatNumber } from '../App';

const StatsPanel = ({ tradeData }) => {
    const stats = useMemo(() => {
        const countries = Object.keys(tradeData);
        const deficitCountries = countries.filter(c => tradeData[c].deficit2024 < 0);
        const surplusCountries = countries.filter(c => tradeData[c].deficit2024 > 0);
        const highTariffCountries = countries.filter(c => tradeData[c].trumpTariffs >= 0.3);
        
        const totalDeficit = countries.reduce((sum, c) => {
            const deficit = tradeData[c].deficit2024;
            return sum + (deficit < 0 ? deficit : 0);
        }, 0);

        return {
            totalCountries: countries.length,
            deficitCount: deficitCountries.length,
            surplusCount: surplusCountries.length,
            totalDeficit: formatNumber(Math.abs(totalDeficit)),
            highTariffCount: highTariffCountries.length,
        };
    }, [tradeData]);

    return (
        <div className="stats-panel">
            <div className="stat-item">
                <div className="stat-value">{stats.totalCountries}</div>
                <div className="stat-label">Countries with Data</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.deficitCount}</div>
                <div className="stat-label">Trade Deficits</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.surplusCount}</div>
                <div className="stat-label">Trade Surplus</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">${stats.totalDeficit}</div>
                <div className="stat-label">Total Trade Deficit</div>
            </div>
             <div className="stat-item">
                <div className="stat-value">{stats.highTariffCount}</div>
                <div className="stat-label">High Tariff Risk</div>
            </div>
        </div>
    );
};

export default StatsPanel;