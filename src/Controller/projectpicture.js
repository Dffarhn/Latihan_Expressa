const { prisma } = require("../../config.js");
const { v4: uuidv4 } = require("uuid");

const sharp = require("sharp");

const UploadProjectPicture = async (req, res, next) => {
  console.log("UploadProjectmasuk");
  try {
    if (!req.files || req.files.length === 0) {
      console.log("UploadProject ksong")
      next();
    } else {
      const uploadPromises = req.files.map(async (file) => {
        const imageData = file.buffer;

        const webpImageData = await sharp(imageData)
          .webp() // Convert to WebP format
          .toBuffer();

        const savedImage = await prisma.project_Images.create({
          data: {
            name: file.originalname,
            data: webpImageData,
          },
        });

        return savedImage.id;
      });

      // Wait for all uploads to complete
      const uploadedImageIds = await Promise.all(uploadPromises);

      req.avatarfiles = uploadedImageIds;

      console.log(req.avatarfiles);

      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const UpdateProjectPictureController = async (req, res, next) => {
  try {
    
    const id = req.params.project_id

    console.log(id)
    const {keep_picture } = req.body; // array yang didalam nya terdapat id foto yang masih di pertahankan
    
    const AProject = await prisma.kahlova_Project.findUnique({
      where: {
        id: id,
      },
    });

    const PictureProjectLama = AProject.project_picture

    // console.log(PictureProjectLama)
    // console.log(keep_picture)
    // bandingkan pictureproject lama dan keep_picture lalu simpan dalam sebuah array PictureProjectLama yang tidak di keep Picture nya lalu array tersebut hapus dari prisma database image
    const pictureToDelete = [];
    PictureProjectLama.map(id_picture =>{
      keep_picture.map(keep_picture =>{
        if (id_picture == keep_picture) {
          //hapus picture pada picture project lama
          
        }else{
          pictureToDelete.push(id_picture)
        }
      })
    })
    // console.log(picturesToKeep)
    // // Menghapus gambar yang tidak di keep dari database
    for (const pictureId of pictureToDelete) {

      console.log(pictureId)
      // await prisma.kahlova_Picture.deleteUnique({
      //   where: { id: pictureId},
      // });
    }

    if (!req.files || req.files.length === 0) {
      console.log("UploadProjectbaru ksong")
      next();
    } else {
      const uploadPromises = req.files.map(async (file) => {
        const imageData = file.buffer;
  
        const webpImageData = await sharp(imageData)
          .webp() // Convert to WebP format
          .toBuffer();

        const savedImage = await prisma.project_Images.create({
          data: {
            name: file.originalname,
            data: webpImageData,
          },
        });

        return savedImage.id;
      });

      // Wait for all uploads to complete
      const uploadedImageIds = await Promise.all(uploadPromises);

      keep_picture.forEach(element => {
        console.log(keep_picture)
        console.log(element)
        uploadedImageIds.push(element)
        
      });

      req.avatarfiles = uploadedImageIds;

      console.log(req.avatarfiles);

      console.log("ini dari dapa brance baru")
      next();

    }

  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { UploadProjectPicture, UpdateProjectPictureController };
