  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  function calculateRestockTimes() {
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    function formatTime(timestamp) {
      return new Date(timestamp).toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone
      });
    }

    const eggInterval = 30 * 60 * 1000;
    const eggRestockTimestamp = today.getTime() + Math.floor((now - today) / eggInterval) * eggInterval;
    const eggCountdownMs = (eggRestockTimestamp + eggInterval) - now;
    const eggCountdown = `${pad(Math.floor(eggCountdownMs / 3.6e6))}h ${pad(Math.floor((eggCountdownMs % 3.6e6) / 6e4))}m ${pad(Math.floor((eggCountdownMs % 6e4) / 1000))}s`;

    const gearInterval = 5 * 60 * 1000;
    const gearRestockTimestamp = today.getTime() + Math.floor((now - today) / gearInterval) * gearInterval;
    const gearCountdownMs = (gearRestockTimestamp + gearInterval) - now;
    const gearCountdown = `${pad(Math.floor(gearCountdownMs / 6e4))}m ${pad(Math.floor((gearCountdownMs % 6e4) / 1000))}s`;

    const cosmeticInterval = 4 * 3600 * 1000;
    const cosmeticRestockTimestamp = today.getTime() + Math.floor((now - today) / cosmeticInterval) * cosmeticInterval;
    const cosmeticCountdownMs = (cosmeticRestockTimestamp + cosmeticInterval) - now;
    const cosmeticCountdown = `${pad(Math.floor(cosmeticCountdownMs / 3.6e6))}h ${pad(Math.floor((cosmeticCountdownMs % 3.6e6) / 6e4))}m ${pad(Math.floor((cosmeticCountdownMs % 6e4) / 1000))}s`;

    const nightInterval = 3600 * 1000;
    const nightRestockTimestamp = today.getTime() + Math.floor((now - today) / nightInterval) * nightInterval;
    const nightCountdownMs = (nightRestockTimestamp + nightInterval) - now;
    const nightCountdown = `${pad(Math.floor(nightCountdownMs / 3.6e6))}h ${pad(Math.floor((nightCountdownMs % 3.6e6) / 6e4))}m ${pad(Math.floor((nightCountdownMs % 6e4) / 1000))}s`;

    return {
      egg: {
        timestamp: eggRestockTimestamp,
        countdown: eggCountdown,
        LastRestock: formatTime(eggRestockTimestamp)
      },
      gear: {
        timestamp: gearRestockTimestamp,
        countdown: gearCountdown,
        LastRestock: formatTime(gearRestockTimestamp)
      },
      seeds: {
        timestamp: gearRestockTimestamp,
        countdown: gearCountdown,
        LastRestock: formatTime(gearRestockTimestamp)
      },
      cosmetic: {
        timestamp: cosmeticRestockTimestamp,
        countdown: cosmeticCountdown,
        LastRestock: formatTime(cosmeticRestockTimestamp)
      },
      nightevent: {
        timestamp: nightRestockTimestamp,
        countdown: nightCountdown,
        LastRestock: formatTime(nightRestockTimestamp)
      }
    };
  }
  
  function register(app) {
    app.get('/api/stock/restock-time', (req, res) => {
      const restockTimes = calculateRestockTimes();
      res.json(restockTimes);
    });
  }
  
  module.exports = { register };
  
