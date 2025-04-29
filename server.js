const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userid;
  if (!userId) return res.status(400).send("Missing userid");

  try {
    const gamesRes = await axios.get(`https://games.roblox.com/v2/users/${userId}/games?limit=50&sortOrder=Asc`);
    const games = gamesRes.data.data;
    if (games.length === 0) return res.json([]);

    const gameId = games[0].id;

    const universeRes = await axios.get(`https://apis.roblox.com/universes/v1/places/${gameId}/universe`);
    const universeId = universeRes.data.universeId;

    const passesRes = await axios.get(`https://games.roblox.com/v1/games/${universeId}/game-passes?limit=50`);
    const passes = passesRes.data.data;

    const result = passes.map(pass => ({
      id: pass.id,
      name: pass.name
    }));

    res.json(result);
  } catch (e) {
    res.status(500).send("Error getting gamepasses");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
