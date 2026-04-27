import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import activityRoutes from './routes/activityRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

app.use(cors())
app.use(express.json())

app.use('/api/activities', activityRoutes)

app.get('/', (req, res) => {
  res.send('API is running')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})