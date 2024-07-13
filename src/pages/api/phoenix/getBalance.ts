import { getBalance } from "../../../services/phoenixApi";

export default async function handler(req, res) {
  return res.status(200).json(await getBalance());
}
