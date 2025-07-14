const https = require("https");

function createOptions(path) {
  return {
    method: "GET",
    hostname: "growagarden.gg",
    path,
    headers: {
      accept: "application/json",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      "cache-control": "no-cache"          // cegah proxy cache
    },
  };
}

function fetchJSON(path) {
  return new Promise((resolve, reject) => {
    const req = https.request(createOptions(path), (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("JSON parse error: " + e.message));
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

// -- Express register -------------------------------------------------------
function register(app) {
  // detail event realtime
  app.get("/api/GetWeather", async (_req, res) => {
    // tambahkan query acak agar proxy tidak meng‑cache 30 detik
    const path = `/api/weather?source=gag&_=${Date.now()}`;
    try {
      const json = await fetchJSON(path);
      res.json(json);
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
  });

  // endpoint lama /stats kalau memang masih ingin
  app.get("/api/GetWeatherStats", async (_req, res) => {
    try {
      const json = await fetchJSON("/api/weather/stats");
      res.json(json);
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
  });
}

module.exports = { register };
