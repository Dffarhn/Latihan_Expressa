const { prisma } = require("../../config");

const VerifyMemberController = async (req, res) => {
  const { token } = req.query;

  try {
    const updatedMember = await prisma.kahlova_Member.update({
      where: {
        verification_token: token,
      },
      data: {
        isConfirm: true, // Assuming `confirm` is the field to update
      },
    });

    if (updatedMember) {
      res.status(200).send("Email verification successful.");
    } else {
      res.status(404).send("Verification token not found or expired.");
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send("Internal server error.");
  }
};

module.exports = { VerifyMemberController };
