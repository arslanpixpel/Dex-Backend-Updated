const FormSubmission = require("../models/FormSubmission");

exports.submitForm = async (req, res) => {
  const { email, username, walletAddress } = req.body;

  const formSubmission = new FormSubmission({
    email,
    username,
    walletAddress,
  });

  try {
    await formSubmission.save();
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
