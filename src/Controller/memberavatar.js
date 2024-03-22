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

      // Save the WebP data to the database using Prisma
      const savedImage = await prisma.images.create({
        data: {
          name: req.file.originalname,
          data: webpImageData,
        },
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
