const mongoose = require('mongoose');

async function moveData() {
  try {
      const conn1 = await mongoose.createConnection('mongodb://127.0.0.1:27017/language-learning', { useNewUrlParser: true, useUnifiedTopology: true }).asPromise();
      const conn2 = await mongoose.createConnection('mongodb://127.0.0.1:27017/gameLangApp', { useNewUrlParser: true, useUnifiedTopology: true }).asPromise();

      const Schema = new mongoose.Schema({ gameType: String, data: mongoose.Schema.Types.Mixed }, { strict: false });
      const Model1 = conn1.model('GameData', Schema, 'gamedatas');
      const Model2 = conn2.model('GameData', Schema, 'gamedatas');

      const docs = await Model1.find({});
      console.log(`Found ${docs.length} docs to move`);
      
      await Model2.deleteMany({});
      for (let d of docs) {
        await Model2.create({ gameType: d.gameType, data: d.data });
      }

      console.log('Successfully migrated data to gameLangApp DB!');
      await conn1.close();
      await conn2.close();
  } catch (err) {
      console.error(err);
  }
}

moveData();
