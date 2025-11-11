import dotenv from "dotenv";

dotenv.config();

const port = process.env.port || 3001;

export { port };
