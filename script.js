// Данные бирж
const exchanges = ['binance', 'kraken', 'eflow', 'coinbase', 'bitfinex'];
let currentExchange = 'binance';

// Базовые курсы криптовалют
const baseRates = {
    BTC: { rate: 75990.86, name: 'Bitcoin' },
    ETH: { rate: 2255.90, name: 'Ethereum' },
    BNB: { rate: 756.14, name: 'Binance Coin' },
    SOL: { rate: 98.28, name: 'Solana' },
    LTC: { rate: 59.95, name: 'Litecoin' },
    AVAX: { rate: 10.00, name: 'Avalanche' },
    LINK: { rate: 9.60, name: 'Chainlink' },
    UNI: { rate: 3.90, name: 'Uniswap' },
    XRP: { rate: 1.50, name: 'XRP' },
    DOT: { rate: 1.51, name: 'Polkadot' }
};

// Обновление времени
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU');
    document.getElementById('time').textContent = timeString;
}

// Генерация данных криптовалют
function generateCryptoData(exchange) {
    const cryptoData = [];
    
    for (const [symbol, data] of Object.entries(baseRates)) {
        const variance = 0.98 + Math.random() * 0.04;
        const rate = data.rate * variance;
        const change = (Math.random() * 4 - 2).toFixed(2);
        const high24h = rate * (1 + Math.random() * 0.05);
        const low24h = rate * (1 - Math.random() * 0.05);
        
        cryptoData.push({
            symbol: symbol,
            name: data.name,
            rate: rate,
            change: parseFloat(change),
            high24h: high24h,
            low24h: low24h
        });
    }
    
    return cryptoData;
}

// Генерация арбитражных возможностей
function generateArbitrageOpportunities() {
    const opportunities = [];
    const cryptos = ['BTC', 'ETH', 'SOL', 'LINK', 'AVAX', 'BNB'];
    
    for (let i = 0; i < 3; i++) {
        const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
        const exchange1 = exchanges[Math.floor(Math.random() * exchanges.length)];
        let exchange2 = exchanges[Math.floor(Math.random() * exchanges.length)];
        
        while (exchange2 === exchange1) {
            exchange2 = exchanges[Math.floor(Math.random() * exchanges.length)];
        }
        
        const profit = (0.5 + Math.random() * 2.5).toFixed(2);
        const buyPrice = (Math.random() * 10000 + 100).toFixed(2);
        const sellPrice = (parseFloat(buyPrice) * (1 + parseFloat(profit) / 100)).toFixed(2);
        
        opportunities.push({
            crypto: crypto,
            buyExchange: exchange1,
            sellExchange: exchange2,
            buyPrice: parseFloat(buyPrice),
            sellPrice: parseFloat(sellPrice),
            profit: parseFloat(profit),
            volume: (Math.random() * 50 + 10).toFixed(2)
        });
    }
    
    return opportunities.sort((a, b) => b.profit - a.profit);
}

// Отображение арбитражных возможностей
function renderArbitrageOpportunities() {
    const opportunities = generateArbitrageOpportunities();
    const grid = document.getElementById('arbitrage-grid');
    
    grid.innerHTML = opportunities.map((opp, index) => `
        <div class="arbitrage-card" style="animation-delay: ${index * 0.1}s">
            <div class="profit-badge">+${opp.profit}%</div>
            <div class="arb-header">
                <span class="arb-crypto">${opp.crypto}</span>
                <span class="arb-label">ARBITRAGE</span>
            </div>
            <div class="arb-details">
                <div class="arb-row">
                    <span class="arb-row-label">Buy:</span>
                    <span class="arb-row-value buy-value">
                        ${opp.buyExchange.toUpperCase()} $${opp.buyPrice.toLocaleString()}
                    </span>
                </div>
                <div class="arb-row">
                    <span class="arb-row-label">Sell:</span>
                    <span class="arb-row-value sell-value">
                        ${opp.sellExchange.toUpperCase()} $${opp.sellPrice.toLocaleString()}
                    </span>
                </div>
                <div class="arb-row arb-divider">
                    <span class="arb-row-label">Volume:</span>
                    <span class="arb-row-value volume-value">
                        ${opp.volume} ${opp.crypto}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Отображение таблицы криптовалют
function renderCryptoTable() {
    const cryptoData = generateCryptoData(currentExchange);
    const tbody = document.getElementById('crypto-tbody');
    
    tbody.innerHTML = cryptoData.map((crypto, index) => {
        const changeClass = crypto.change >= 0 ? 'positive' : 'negative';
        const changeIcon = crypto.change >= 0 ? '▲' : '▼';
        
        return `
            <tr style="animation-delay: ${index * 0.05}s">
                <td>
                    <div class="currency-cell">
                        <div class="currency-icon">
                            ${crypto.symbol.substring(0, 2)}
                        </div>
                        <div class="currency-info">
                            <span class="currency-symbol">${crypto.symbol}</span>
                            <span class="currency-name">${crypto.name}</span>
                        </div>
                    </div>
                </td>
                <td class="text-right">
                    <span class="rate">$${crypto.rate.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</span>
                </td>
                <td class="text-right">
                    <span class="change ${changeClass}">
                        ${changeIcon} ${Math.abs(crypto.change)}%
                    </span>
                </td>
                <td class="text-right">
                    <span class="high">$${crypto.high24h.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</span>
                </td>
                <td class="text-right">
                    <span class="low">$${crypto.low24h.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</span>
                </td>
            </tr>
        `;
    }).join('');
}

// Обработка выбора биржи
function setupExchangeButtons() {
    const buttons = document.querySelectorAll('.exchange-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активный класс со всех кнопок
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке
            button.classList.add('active');
            
            // Обновляем текущую биржу
            currentExchange = button.dataset.exchange;
            
            // Перерисовываем таблицу
            renderCryptoTable();
        });
    });
}

// Обновление всех данных
function updateAllData() {
    updateTime();
    renderArbitrageOpportunities();
    renderCryptoTable();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setupExchangeButtons();
    updateAllData();
    
    // Обновление времени каждую секунду
    setInterval(updateTime, 1000);
    
    // Обновление данных каждые 5 секунд
    setInterval(() => {
        renderArbitrageOpportunities();
        renderCryptoTable();
    }, 5000);
});
