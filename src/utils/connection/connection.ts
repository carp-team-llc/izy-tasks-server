
import { config } from "dotenv";
import { PrismaClient } from '@prisma/client'

config({ path: '.env.development' });

const prisma = new PrismaClient();

export default prisma;