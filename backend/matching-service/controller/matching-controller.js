export async function respHelloWorld(req, res) {
  try {
    return res.status(200).json({ message: "Hello World!" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}