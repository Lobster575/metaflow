// Данные бирж
const exchanges = ['binance', 'kraken', 'eflow', 'coinbase', 'bitfinex'];
let currentExchange = 'binance';
let currentChartType = 'line';
let currentCrypto = 'BTC';
let priceChart = null;
let chartData = {
    BTC: [],
    ETH: [],
    SOL: [],
    BNB: [],
    AVAX: []
};

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

// Инициализация графика
function initChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Генерируем начальные данные для всех криптовалют
    const now = Date.now();
    ['BTC', 'ETH', 'SOL', 'BNB', 'AVAX'].forEach(crypto => {
        chartData[crypto] = [];
        for (let i = 30; i >= 0; i--) {
            const time = now - i * 2000;
            const basePrice = baseRates[crypto].rate;
            const price = basePrice * (0.98 + Math.random() * 0.04);
            chartData[crypto].push({
                time: time,
                price: price,
                open: price * 0.995,
                high: price * 1.005,
                low: price * 0.995,
                close: price
            });
        }
    });
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData[currentCrypto].map(d => new Date(d.time).toLocaleTimeString()),
            datasets: [{
                label: `${currentCrypto} Price (USD)`,
                data: chartData[currentCrypto].map(d => d.price),
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#ec4899',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#d8b4fe',
                        font: {
                            family: "'Courier New', monospace",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderColor: '#a855f7',
                    borderWidth: 1,
                    titleColor: '#d8b4fe',
                    bodyColor: '#ffffff',
                    titleFont: {
                        family: "'Courier New', monospace"
                    },
                    bodyFont: {
                        family: "'Courier New', monospace"
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(168, 85, 247, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a855f7',
                        font: {
                            family: "'Courier New', monospace",
                            size: 10
                        },
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(168, 85, 247, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a855f7',
                        font: {
                            family: "'Courier New', monospace",
                            size: 10
                        },
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Обновление графика
function updateChart() {
    if (!priceChart) return;
    
    const now = Date.now();
    const basePrice = baseRates[currentCrypto].rate;
    const price = basePrice * (0.98 + Math.random() * 0.04);
    
    // Добавляем новую точку
    chartData[currentCrypto].push({
        time: now,
        price: price,
        open: price * 0.995,
        high: price * 1.005,
        low: price * 0.995,
        close: price
    });
    
    // Ограничиваем количество точек
    if (chartData[currentCrypto].length > 30) {
        chartData[currentCrypto].shift();
    }
    
    // Обновляем данные графика
    if (currentChartType === 'line') {
        priceChart.data.labels = chartData[currentCrypto].map(d => 
            new Date(d.time).toLocaleTimeString()
        );
        priceChart.data.datasets[0].data = chartData[currentCrypto].map(d => d.price);
        priceChart.data.datasets[0].label = `${currentCrypto} Price (USD)`;
    } else {
        // Для свечей
        priceChart.data.labels = chartData[currentCrypto].map(d => 
            new Date(d.time).toLocaleTimeString()
        );
        priceChart.data.datasets = [{
            label: `${currentCrypto} OHLC`,
            data: chartData[currentCrypto].map(d => ({
                x: new Date(d.time).toLocaleTimeString(),
                o: d.open,
                h: d.high,
                l: d.low,
                c: d.close
            })),
            borderColor: chartData[currentCrypto].map(d => 
                d.close >= d.open ? '#4ade80' : '#ef4444'
            ),
            backgroundColor: chartData[currentCrypto].map(d => 
                d.close >= d.open ? 'rgba(74, 222, 128, 0.5)' : 'rgba(239, 68, 68, 0.5)'
            )
        }];
    }
    
    priceChart.update('none');
}

// Переключение типа графика
function setupChartControls() {
    // Переключение типа графика
    const chartTypeBtns = document.querySelectorAll('.chart-type-btn');
    chartTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chartTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentChartType = btn.dataset.type;
            
            if (currentChartType === 'line') {
                priceChart.config.type = 'line';
                priceChart.data.datasets = [{
                    label: `${currentCrypto} Price (USD)`,
                    data: chartData[currentCrypto].map(d => d.price),
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#ec4899',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                }];
            } else {
                priceChart.config.type = 'bar';
                priceChart.data.datasets = [{
                    label: `${currentCrypto} OHLC`,
                    data: chartData[currentCrypto].map(d => d.close),
                    backgroundColor: chartData[currentCrypto].map(d => 
                        d.close >= d.open ? 'rgba(74, 222, 128, 0.7)' : 'rgba(239, 68, 68, 0.7)'
                    ),
                    borderColor: chartData[currentCrypto].map(d => 
                        d.close >= d.open ? '#4ade80' : '#ef4444'
                    ),
                    borderWidth: 1
                }];
            }
            
            priceChart.update();
        });
    });
    
    // Выбор криптовалюты
    const cryptoSelect = document.getElementById('chart-crypto');
    cryptoSelect.addEventListener('change', (e) => {
        currentCrypto = e.target.value;
        updateChart();
        priceChart.update();
    });
}

// Обновление всех данных
function updateAllData() {
    updateTime();
    renderArbitrageOpportunities();
    renderCryptoTable();
    updateChart();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setupExchangeButtons();
    setupChartControls();
    updateAllData();
    
    // Инициализация графика
    setTimeout(() => {
        initChart();
    }, 100);
    
    // Обновление времени каждую секунду
    setInterval(updateTime, 1000);
    
    // Обновление данных каждые 2 секунды
    setInterval(() => {
        renderArbitrageOpportunities();
        renderCryptoTable();
        updateChart();
    }, 2000);
});
