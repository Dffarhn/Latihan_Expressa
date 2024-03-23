const { prisma } = require("../../config.js");
const sharp = require('sharp'); 

const InsertAvatarMemberController = async (req, res, next) => {
  try {
    if (!req.file) {
      next();
    } else {
      // Convert the uploaded file (Buffer) to bytea data
      const imageData = req.file.buffer;

      // Convert the image to WebP format using sharp library
      const webpImageData = await sharp(imageData)
        .webp() // Convert to WebP format
        .toBuffer();

      const memberId = req.params.member_id;

      const memberdata = await prisma.kahlova_Member.findUnique({
        where: {
          id: parseInt(memberId, 10),
        },
      });


      const savedImage = await prisma.images.upsert({
        where: { id: memberdata.avatar},
        update: { data: webpImageData, name: req.file.originalname },
        create: { name: req.file.originalname,data: webpImageData, },
      });


      req.avatarfile = savedImage.id;

      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { InsertAvatarMemberController };
