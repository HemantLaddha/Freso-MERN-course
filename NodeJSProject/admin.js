const express = require("express");
const Admin = require("../mongoose/models/admin");
const jwt = require("jsonwebtoken");
const Players = require("../mongoose/models/players");

//setting up the admin router
const adminRouter = express.Router();

//write your code for admin endpoints here
adminRouter.post('/login', async (req, res) => {
  const a = await Admin.findOne(req.body)
  if (!a) {
    return res.status(400).send()
  }
  const token = jwt.sign({ _id: a._id }, "xeEo2MOol8CeWr7Nw2g2GjH8QEUK4dyyKCHi4TYJKéznm5fuAHIIPHSQ5YvdVcLlnaxppN64xK6xbhRileWvIlzCEqrBMCiITD8z")
  a.tokens.push({ token: token })
  a.save()
  return res.status(200).send()
})

adminRouter.post('/addPlayer', async (req, res) => {
  if (req.body.name.length < 3 || req.body.age < 15 || !['Batsman', 'Bowler', 'All-rounder'].includes(req.body.type) || !['Right', 'Left', 'NA'].includes(req.body.bats) || !['Right', 'Left', 'NA'].includes(req.body.bowls) || !['Fast', 'Medium', 'Spin', 'Leg-spin', 'Chinaman'].includes(req.body.bowling_style)) {
    return res.status(400).send()
  }
  await new Players(req.body).save()
  return res.status(201).send()
})

adminRouter.get('/viewPlayer/:id', async (req, res) => {
  const a = await Players.findById(req.params.id)
  return res.status(200).send(a)
})

adminRouter.patch('/editPlayer/:id', async (req, res) => {
  const a = await Players.findByIdAndUpdate(req.params.id, req.body)
  return res.status(200).send(a)
})

adminRouter.delete('/deletePlayer/:id', async (req, res) => {
  await Players.findByIdAndDelete(req.params.id)
  return res.status(200).send()
})

adminRouter.get('/viewPlayers/:team', async (req, res) => {
  const a = await Players.find({ bought_by: req.params.team })
  return res.status(200).send(a)
})

adminRouter.patch('/playerBought/:team', async (req, res) => {
  const a = await Players.findByIdAndUpdate(req.body.id, { unsold: false, bidded_by: req.params.team })
  return res.status(200).send(a)
})

adminRouter.get('/displayPlayer/:count', async (req, res) => {
  const a = await Players.find({ unsold: true, displayed_count: Number(req.params.count), type: req.query.type }).sort({ base_price: -1 }).limit(1)
  await Players.findByIdAndUpdate(a[0]._id, { displayed_count: Number(req.params.count) + 1 })
  return res.status(200).send(a)
})

adminRouter.patch('/players/bid/:id', async (req, res) => {
  const a = await Players.findById(req.params.id)
  let sp = a.sold_price ? a.sold_price : a.base_price
  if (sp >= 1000000 && sp < 10000000) {
    sp += 500000
  } else if (sp >= 10000000 && sp < 50000000) {
    sp += 1000000
  } else if (sp >= 50000000 && sp < 100000000) {
    sp += 2500000
  } else if (sp >= 100000000 && sp < 200000000) {
    sp += 5000000
  } else if (sp >= 200000000) {
    sp += 10000000
  }
  await Players.findByIdAndUpdate(req.params.id, { sold_price: sp, bidded_by: req.body.teamName })
  return res.status(200).send()
})

module.exports = adminRouter;
