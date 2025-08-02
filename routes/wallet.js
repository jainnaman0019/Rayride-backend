// const express = require('express');
// const router = express.Router();
// const db = require('../services/firebase');

// // ✅ Get wallet overview (balance + other fields)
// // router.get('/:userId', async (req, res) => {
// //   console.log("🟢 Hit route /:userId with", req.params.userId);
// //   try {
// //     const doc = await db.collection('wallets').doc(req.params.userId).get();
// //     if (!doc.exists) return res.status(404).send({ error: "Wallet not found" });
// //     res.send(doc.data());
// //   } catch (err) {
// //     res.status(500).send({ error: err.message });
// //   }
// // });

// router.get('/:userId', async (req, res) => {
//   console.log("🟢 Hit route /:userId with", req.params.userId);
//   try {
//     const walletRef = db.collection('wallets').doc(req.params.userId);
//     const doc = await walletRef.get();

//     if (!doc.exists) {
//       // Auto-create wallet if not found
//       const newWallet = {
//         balance: 0,
//         createdAt: new Date().toISOString(),
//       };
//       await walletRef.set(newWallet);
//       return res.send(newWallet);
//     }

//     res.send(doc.data());
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });


// router.get('/history', async (req, res) => {
//   try {
//     const snapshot = await db.collection('wallet_logs').orderBy('date', 'desc').get();
//     const logs = snapshot.docs.map(doc => doc.data());
//     res.send(logs);
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });

// // ✅ Get wallet transaction logs
// router.get('/:userId/logs', async (req, res) => {
//   console.log("🟢 Hit route /:userId/logs with", req.params.userId);
//   try {
//     const snapshot = await db.collection('wallet_logs')
//       .where('userId', '==', req.params.userId)
//       .orderBy('date', 'desc')
//       .get();
//     const logs = snapshot.docs.map(doc => doc.data());
//     res.send(logs);
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });

// // ✅ Add funds to wallet
// router.post('/topup', async (req, res) => {
//   const { userId, amount } = req.body;
//   if (!userId || !amount) return res.status(400).send({ error: "Missing userId or amount" });

//   try {
//     const walletRef = db.collection('wallets').doc(userId);
//     const walletDoc = await walletRef.get();
//     let balance = 0;

//     if (!walletDoc.exists) {
//       await walletRef.set({ balance: amount });
//       balance = amount;
//     } else {
//       balance = walletDoc.data().balance + amount;
//       await walletRef.update({ balance });
//     }

//     await db.collection('wallet_logs').add({
//       userId,
//       type: "topup",
//       amount,
//       date: new Date().toISOString()
//     });

//     res.send({ userId, balance });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });

// // ✅ Deduct funds (e.g. ride fare)
// router.post('/deduct', async (req, res) => {
//   const { userId, amount } = req.body;
//   if (!userId || !amount) return res.status(400).send({ error: "Missing userId or amount" });

//   try {
//     const walletRef = db.collection('wallets').doc(userId);
//     const walletDoc = await walletRef.get();

//     if (!walletDoc.exists) return res.status(404).send({ error: "Wallet not found" });

//     const currentBalance = walletDoc.data().balance;
//     if (currentBalance < amount) return res.status(400).send({ error: "Insufficient balance" });

//     const newBalance = currentBalance - amount;
//     await walletRef.update({ balance: newBalance });

//     await db.collection('wallet_logs').add({
//       userId,
//       type: "deduct",
//       amount,
//       date: new Date().toISOString()
//     });

//     res.send({ userId, balance: newBalance });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });

// // ✅ Withdraw funds from wallet
// router.post('/withdraw', async (req, res) => {
//   const { userId, amount } = req.body;
//   if (!userId || !amount) return res.status(400).send({ error: "Missing userId or amount" });

//   try {
//     const walletRef = db.collection('wallets').doc(userId);
//     const walletDoc = await walletRef.get();

//     if (!walletDoc.exists) return res.status(404).send({ error: "Wallet not found" });

//     const currentBalance = walletDoc.data().balance;
//     if (currentBalance < amount) return res.status(400).send({ error: "Insufficient balance" });

//     const newBalance = currentBalance - amount;
//     await walletRef.update({ balance: newBalance });

//     await db.collection('wallet_logs').add({
//       userId,
//       type: "withdraw",
//       amount,
//       date: new Date().toISOString()
//     });

//     res.send({ userId, balance: newBalance });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });

// // ✅ Get only wallet balance
// router.get('/balance/:userId', async (req, res) => {
//   try {
//     const walletDoc = await db.collection('wallets').doc(req.params.userId).get();
//     if (!walletDoc.exists) return res.status(404).send({ error: "Wallet not found" });

//     res.send({ balance: walletDoc.data().balance });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../services/firebase');

// ✅ Get only wallet balance (MUST come before /:userId)
router.get('/balance/:userId', async (req, res) => {
  try {
    const walletDoc = await db.collection('wallets').doc(req.params.userId).get();
    if (!walletDoc.exists) return res.status(404).send({ error: "Wallet not found" });

    res.send({ balance: walletDoc.data().balance });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ✅ Get all transaction history (not user-specific)
router.get('/history', async (req, res) => {
  try {
    const snapshot = await db.collection('wallet_logs').orderBy('date', 'desc').get();
    const logs = snapshot.docs.map(doc => doc.data());
    res.send(logs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ✅ Get wallet transaction logs for a specific user
router.get('/:userId/logs', async (req, res) => {
  console.log("🟢 Hit route /:userId/logs with", req.params.userId);
  try {
    const snapshot = await db.collection('wallet_logs')
      .where('userId', '==', req.params.userId)
      .orderBy('date', 'desc')
      .get();
    const logs = snapshot.docs.map(doc => doc.data());
    res.send(logs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ✅ Get wallet overview (with auto-create)
router.get('/:userId', async (req, res) => {
  console.log("🟢 Hit route /:userId with", req.params.userId);
  try {
    const walletRef = db.collection('wallets').doc(req.params.userId);
    const doc = await walletRef.get();

    if (!doc.exists) {
      const newWallet = {
        balance: 0,
        createdAt: new Date().toISOString(),
        todayEarnings: 0,
        weeklyEarnings: 0
      };
      await walletRef.set(newWallet);
      return res.send(newWallet);
    }

    res.send(doc.data());
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ✅ Add funds to wallet
router.post('/topup', async (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) return res.status(400).send({ error: "Missing userId or amount" });

  try {
    const walletRef = db.collection('wallets').doc(userId);
    const walletDoc = await walletRef.get();
    let balance = 0;

    if (!walletDoc.exists) {
      await walletRef.set({ balance: amount });
      balance = amount;
    } else {
      balance = walletDoc.data().balance + amount;
      await walletRef.update({ balance });
    }

    await db.collection('wallet_logs').add({
      userId,
      type: "topup",
      amount,
      date: Date.now(),
      note: "Wallet top-up"
    });

    res.send({ userId, balance });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ✅ Deduct funds from wallet (e.g. for rides)
router.post('/deduct', async (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) return res.status(400).send({ error: "Missing userId or amount" });

  try {
    const walletRef = db.collection('wallets').doc(userId);
    const walletDoc = await walletRef.get();

    if (!walletDoc.exists) return res.status(404).send({ error: "Wallet not found" });

    const currentBalance = walletDoc.data().balance;
    if (currentBalance < amount) return res.status(400).send({ error: "Insufficient balance" });

    const newBalance = currentBalance - amount;
    await walletRef.update({ balance: newBalance });

    await db.collection('wallet_logs').add({
      userId,
      type: "deduct",
      amount,
      date: Date.now(),
      note: "Ride fare"
    });

    res.send({ userId, balance: newBalance });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ✅ Withdraw funds
router.post('/withdraw', async (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) return res.status(400).send({ error: "Missing userId or amount" });

  try {
    const walletRef = db.collection('wallets').doc(userId);
    const walletDoc = await walletRef.get();

    if (!walletDoc.exists) return res.status(404).send({ error: "Wallet not found" });

    const currentBalance = walletDoc.data().balance;
    if (currentBalance < amount) return res.status(400).send({ error: "Insufficient balance" });

    const newBalance = currentBalance - amount;
    await walletRef.update({ balance: newBalance });

    await db.collection('wallet_logs').add({
      userId,
      type: "withdraw",
      amount,
      date: Date.now(),
      note: "Wallet withdrawal"
    });

    res.send({ userId, balance: newBalance });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
