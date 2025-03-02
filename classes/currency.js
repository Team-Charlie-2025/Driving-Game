// currency.js
class CurrencyManager {
    static computeCoinsEarned(coinsCollected, difficultyModifier) {
      coinsCollected = Number(coinsCollected) || 0;
      difficultyModifier = Number(difficultyModifier) || 1;
      return difficultyModifier * ((5 / 4) * Math.pow(coinsCollected, 2));
    }
  
    // json setter +=
    static updateTotalCoins(coinsEarned) {
      const data = loadPersistentData();
      if (typeof data.totalCoins !== 'number') {
        data.totalCoins = 0;
      }
      data.totalCoins += coinsEarned;
      savePersistentData(data);
    }

    // json getter
    static getTotalCoins() {
      const data = loadPersistentData();
      return data.totalCoins || 0;
    }
  }
  