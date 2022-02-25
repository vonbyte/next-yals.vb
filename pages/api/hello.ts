// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from "./_connector";

const Hello = async (req, res) => {
  await connectToDatabase();
  res.status(200).json({ name: "John Doe" });
};
export default Hello;