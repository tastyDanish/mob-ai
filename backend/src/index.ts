import express, { Request, Response } from 'express';

const app = express();
const port = 5001;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World! This is the backend server.');
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});