const { prisma } = require("../../config");

async function getImageData(id) {
    const image = await prisma.images.findUnique({
      where: {
        id: id,
      },
    });
    return image ? image.data : null; // Return null if image is not found
  }

function convertByteaToBase64(byteaData) {
    return Buffer.from(byteaData).toString('base64');
}

module.exports = {getImageData,convertByteaToBase64}