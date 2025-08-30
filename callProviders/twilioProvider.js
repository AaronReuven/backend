require('dotenv').config();
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER
const EVALUATOR_PHONE = process.env.EVALUATOR_PHONE

const twilio = require('twilio')

exports.placeCall = async ({ to }) => {
  console.log(process.env.TWILIO_ACCOUNT_SID)
  if (!TWILIO_ACCOUNT_SID) throw new Error('TWILIO_ACCOUNT_SID not set')
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Connecting you now</Say><Dial>${EVALUATOR_PHONE}</Dial></Response>`

  const call = await client.calls.create({
    to,
    from: TWILIO_FROM_NUMBER,
    twiml
  })
  return { sid: call.sid }
}