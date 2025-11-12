import dotenv from "dotenv";

dotenv.config();

const port = process.env.port || 3001;
const frontend_url = process.env.FRONTEND_URL;

export { port, frontend_url };
