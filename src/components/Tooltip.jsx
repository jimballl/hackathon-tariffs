import React from 'react';
import { formatNumber, formatPopulation } from '../App';

const getTariffClass = (tariff) => {
    if (tariff >= 0.5) return 'tariff-high';
    if (tariff >= 0.2) return 'tariff-medium';
    return 'tariff-low';
};

const Tooltip = ({ visible, content, x, y }) => {
    if (!visible) return null;

    const { name, trade, basic } = content;
    const style = {
        position: 'absolute',
        left: `${x + 15}px`,
        top: `${y + 15}px`,
    };

    return (
        <div className="tooltip show" style={style}>
            <h3>
                {basic?.flag && <span className="flag">{basic.flag}</span>}
                {name}
            </h3>
            {trade ? (
                <>
                    <p><strong>Population:</strong> {formatPopulation(trade.population)}</p>
                    <h4>📊 US Trade Data 2024</h4>
                    <p>
                        <strong className={trade.deficit2024 < 0 ? 'deficit-negative' : 'deficit-positive'}>
                            {trade.deficit2024 < 0 ? 'Trade Deficit' : 'Trade Surplus'}:
                        </strong>
                        <span className="trade-value"> ${formatNumber(Math.abs(trade.deficit2024))}</span>
                    </p>
                    <p><strong>US Exports:</strong> <span className="trade-value">${formatNumber(trade.exports2024)}</span></p>
                    <p><strong>US Imports:</strong> <span className="trade-value">${formatNumber(trade.imports2024)}</span></p>
                    <p><strong>Trump Tariffs:</strong> <span className={getTariffClass(trade.trumpTariffs)}>{(trade.trumpTariffs * 100).toFixed(0)}%</span></p>
                </>
            ) : (
                <p><em>No US trade data available.</em></p>
            )}
        </div>
    );
};

export default Tooltip;