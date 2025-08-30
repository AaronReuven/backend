const fetch = require('node-fetch')
require('dotenv').config();
const VAPI_API_KEY = process.env.VAPI_API_KEY
const VAPI_ACCOUNT = process.env.VAPI_ACCOUNT
const EVALUATOR_PHONE = process.env.EVALUATOR_PHONE

exports.placeCall = async ({ to }) => {
  if (!VAPI_API_KEY) throw new Error('VAPI_API_KEY not set')

  const url = 'https://api.vapi.ai/v1/calls'
  const body = {
    to,
    connect_to: EVALUATOR_PHONE
  }

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VAPI_API_KEY}`
    },
    body: JSON.stringify(body)
  })

  if (!r.ok) {
    const txt = await r.text()
    throw new Error('VAPI error: ' + txt)
  }
  return r.json()
}