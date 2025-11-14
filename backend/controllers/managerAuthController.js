require("dotenv").config();

const managerLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required"
    });
  }

  const managers = [
    { email: process.env.MANAGER1_EMAIL, password: process.env.MANAGER1_PASSWORD },
    { email: process.env.MANAGER2_EMAIL, password: process.env.MANAGER2_PASSWORD }
  ];

  const validManager = managers.find(
    (m) => m.email === email && m.password === password
  );

  if (!validManager) {
    return res.status(401).json({
      success: false,
      error: "Invalid manager credentials"
    });
  }

  res.status(200).json({
    success: true,
    message: "✅ Manager login successful",
    manager: validManager.email
  });
};

module.exports = { managerLogin };
