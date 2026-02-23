import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })