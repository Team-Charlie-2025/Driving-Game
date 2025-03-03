// classes/score.js

class ScoreManager {

    static computeScore(time, enemyTypeDestroyed, coinsCollected) {
      time = Number(time) || 0;
      enemyTypeDestroyed = Number(enemyTypeDestroyed) || 0;
      coinsCollected = Number(coinsCollected) || 0;
      // remember that calc?? n(n+1)/2 = sum.
      // equates 1 if nothing killed yet to avoid 0 scores
      let enemySum = enemyTypeDestroyed < 1 ? 1 : (enemyTypeDestroyed * (enemyTypeDestroyed + 1)) / 2;
  
      const baseScore = Math.floor(window.difficulty *
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
  }
  