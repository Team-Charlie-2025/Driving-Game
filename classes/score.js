class ScoreManager {

  static computeScore(time, enemyTypeDestroyed, coinsCollected, difficultyModifier) {
    time = Number(time) || 0;
    enemyTypeDestroyed = Number(enemyTypeDestroyed) || 0;
    coinsCollected = Number(coinsCollected) || 0;
    difficultyModifier = Number(difficultyModifier) || 1;
    // remember that calc?? n(n+1)/2 = sum.
    // equates 1 if nothing killed yet to avoid 0 scores
    let enemySum = enemyTypeDestroyed < 1 ? 1 : (enemyTypeDestroyed * (enemyTypeDestroyed + 1)) / 2;

    const baseScore = Math.floor(difficultyModifier *
                      (200 * coinsCollected) *
                      enemySum *
                      Math.log(1 + time / 25));
    return Math.min(baseScore, 99999);
  }

  static updateHighScore(newScore) {
    const data = loadPersistentData();
    if (typeof data.highScore !== 'number') {
      data.highScore = 0;
    }
    if (newScore > data.highScore) {
      data.highScore = newScore;
      savePersistentData(data);
    }
  }

  static getHighScore() {
    const data = loadPersistentData();
    return data.highScore || 0;
  }

  // New method to send the score to the server
  static sendScoreToServer(playerName, score) {
    const data = { username: playerName, score: score };

    fetch(`${BACKEND_URL}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Score successfully sent:', data);
    })
    .catch(error => {
      console.error('Error sending score:', error);
    });
  }
}
