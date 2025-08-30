const express = require('express')
const bodyParser = require('body-parser')
const twilioProvider = require('./callProviders/twilioProvider')
const vapiProvider = require('./callProviders/vapiProvider')
require('dotenv').config();

const app = express()
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

function isE164(number) {
  return /^\+[1-9]\d{1,14}$/.test(number)
}

app.post('/api/call', async (req, res) => {
  const { phoneNumber } = req.body || {}
  if (!phoneNumber) return res.status(400).json({ error: 'phoneNumber required' })
  if (!isE164(phoneNumber)) return res.status(400).json({ error: 'Invalid phone number — use E.164, e.g. +12025550123' })

  const provider = (process.env.CALL_PROVIDER || 'twilio').toLowerCase()
  try {
    if (provider === 'twilio') {
      const r = await twilioProvider.placeCall({ to: phoneNumber })
      return res.json({ message: 'twilio initiated', data: r })
    } else if (provider === 'vapi') {
      const r = await vapiProvider.placeCall({ to: phoneNumber })
      return res.json({ message: 'vapi initiated', data: r })
    } else {
      return res.status(400).json({ error: 'Unknown CALL_PROVIDER' })
    }
  } catch (err) {
    console.error('call error', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
})

app.get('/', (req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log('Server listening on', PORT))