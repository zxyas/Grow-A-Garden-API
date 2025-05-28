function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  
  function calculateRestockTimes() {
    const now = new Date();
      const nextHalfHour = new Date(now);

    const minutes = now.getMinutes();
    if (minutes < 30) {
      nextHalfHour.setMinutes(30, 0, 0);
    } else {
      nextHalfHour.setHours(now.getHours() + 1);
      nextHalfHour.setMinutes(0, 0, 0);
    }
  
    const distEgg = nextHalfHour - now;
    const hEgg = Math.floor(distEgg / 3.6e6);
    const mEgg = Math.floor((distEgg % 3.6e6) / 6e4);
    const sEgg = Math.floor((distEgg % 6e4) / 1000);
    const eggCountdown = `${pad(hEgg)}h ${pad(mEgg)}m ${pad(sEgg)}s`;
    const eggTimestamp = nextHalfHour.getTime();
  
    const next5 = new Date(now);
    const nextM = Math.ceil((now.getMinutes() + (now.getSeconds() > 0 ? 1 : 0)) / 5) * 5;
    if (nextM === 60) {
      next5.setHours(next5.getHours() + 1);
      next5.setMinutes(0, 0, 0);
    } else {
      next5.setMinutes(nextM, 0, 0);
    }
  
    const dist5 = next5 - now;
    const m5 = Math.floor(dist5 / 6e4);
    const s5 = Math.floor((dist5 % 6e4) / 1000);
    const gearAndSeedsCountdown = `${pad(m5)}m ${pad(s5)}s`;
    const gearAndSeedsTimestamp = next5.getTime();

    const RefreshTime = 14400;
    const RefreshTime2 = 3600;
    const nowSec = Math.ceil(Date.now() / 1000);
    const remainingTime = RefreshTime - (nowSec % RefreshTime);
    const hrs = Math.floor(remainingTime / 3600);
    const mins = Math.floor((remainingTime % 3600) / 60);
    const secs = remainingTime % 60;
    const resetCountdown = `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
    const resetTimestamp = (nowSec + remainingTime) * 1000;
    
    const remainingTime2 = RefreshTime2 - (nowSec % RefreshTime2);
    const hrs2 = Math.floor(remainingTime2 / 3600);
    const mins2 = Math.floor((remainingTime2 % 3600) / 60);
    const secs2 = remainingTime2 % 60;
    const resetCountdown2 = `${pad(hrs2)}h ${pad(mins2)}m ${pad(secs2)}s`;
    const resetTimestamp2 = (nowSec + remainingTime2) * 1000;
    
  
    return {
      egg: {
        timestamp: eggTimestamp,
        countdown: eggCountdown
      },
      gear: {
        timestamp: gearAndSeedsTimestamp,
        countdown: gearAndSeedsCountdown
      },
      seeds: {
        timestamp: gearAndSeedsTimestamp,
        countdown: gearAndSeedsCountdown
      },
      cosmetic: {
        timestamp: resetTimestamp,
        countdown: resetCountdown
      },
      nightevent: {
        timestamp: resetTimestamp2,
        countdown: resetCountdown2
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
  