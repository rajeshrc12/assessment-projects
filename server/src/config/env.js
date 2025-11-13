import dotenv from "dotenv";

dotenv.config();

const port = process.env.port || 3001;
const frontend_url = process.env.FRONTEND_URL;
const jwt_secret = process.env.JWT_SECRET;
const jwt_expire = process.env.JWT_EXPIRE;
const database_url = process.env.DATABASE_URL;

export { port, frontend_url, jwt_secret, jwt_expire, database_url };
