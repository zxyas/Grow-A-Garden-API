const https = require("https");

const stockOptions = {
    hostname: "growagardenvalues.com",
    port: 443,
    path: "/stock/refresh_stock.php",
    headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest",
    }
};

async function fetchStockData(type) {
    return new Promise((resolve, reject) => {
        const options = { ...stockOptions, path: `/stock/refresh_stock.php?type=${type}` };
        
        const req = https.request(options, (res) => {
            const chunks = [];
            
            res.on("data", (chunk) => chunks.push(chunk));
            
            res.on("end", () => {
                const body = Buffer.concat(chunks).toString();
                try {
                    const parsedData = JSON.parse(body);
                    resolve(parsedData);
                } catch (err) {
                    reject({
                        status: 500,
                        message: `Invalid JSON response for ${type}: ${err.message}`
                    });
                }
            });
        });
        
        req.on("error", (e) => {
            reject({
                status: 502,
                message: `Problem with ${type} request: ${e.message}`
            });
        });
        
        req.end();
    });
}

async function fetchAllStocks() {
    try {
        const [gears, seeds, eggs, eventShop, cosmetics] = await Promise.all([
            fetchStockData("gears"),
            fetchStockData("seeds"),
            fetchStockData("eggs"),
            fetchStockData("event-shop-stock"),
            fetchStockData("cosmetics")
        ]);
        
        return {
            gears,
            seeds,
            eggs,
            eventShop,
            cosmetics
        };
    } catch (error) {
        throw error;
    }
}

function formatStockItems(records) {
    return records.map(item => ({
        name: item.Data.Name,
        value: item.Amount,
    }));
}

function formatStocks(data) {
    return {
        gearStock: formatStockItems(data.gears.data.records),
        seedsStock: formatStockItems(data.seeds.data.records),
        eggStock: formatStockItems(data.eggs.data.records),
        BeeStock: formatStockItems(data.eventShop.data.records),
        cosmeticsStock: formatStockItems(data.cosmetics.data.records),
    };
}

async function register(app) {
    app.get('/api/stock/GetStock', async (req, res) => {
        try {
            const stockData = await fetchAllStocks();
            const formattedStocks = formatStocks(stockData);
            
            res.status(200).json({
                success: true,
                ...formattedStocks
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                error: {
                    code: error.status || 500,
                    message: error.message
                }
            });
        }
    });
}

module.exports = { register };
