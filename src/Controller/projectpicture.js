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
    const { id, past_picture } = req.body;

    const { data } = await supabase.from("kahlova_project").select("foto_project").eq("id", id);

    const uuidFolderStorage = data[0].foto_project[0].substring(0, data[0].foto_project[0].indexOf("/"));

    // Retrieve past pictures
    const pastPictures = past_picture
      ? await Promise.all(
          past_picture.map(async (element) => {
            const { data, error } = await supabase.storage.from("project_picture").download(element);

            const arrayBuffer = await data.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            return Buffer.from(uint8Array);
          })
        )
      : [];

    // Combine past pictures and new files
    const data_update_foto = pastPictures.concat(req.files.map((file) => file.buffer));

    // Upload all images in data_update_foto
    req.update_picture = await Promise.all(
      data_update_foto.map(async (buffer, index) => {
        const filename = `${uuidFolderStorage}/${index}`;
        const { data: uploaddata, error: errorupload } = await supabase.storage.from("project_picture").upload(filename, buffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

        if (errorupload) {
          throw errorupload;
        }

        console.log(`File ${index} uploaded successfully:`, uploaddata);
        return filename;
      })
    );

    // if(req.update_picture.length <= supabase.storage.from('project_kahlova').copy.length){
    //     //hapus file storage yang melebihi nya
    // }

    const { data: datafotonow, error: errorfotonow } = await supabase.storage.from("project_picture").list(`${uuidFolderStorage}`);

    console.log(datafotonow.length);

    let databarulength = req.update_picture.length;

    while (databarulength < datafotonow.length) {
      const filenamedeleted = `${uuidFolderStorage}/${databarulength}`;
      const { error: removeError } = await supabase.storage.from("project_picture").remove(filenamedeleted);

      if (removeError) {
        // Handle error during file removal (log, throw, etc.)
        console.error(`Error removing file ${uuidFolderStorage}/${databarulength}:`, removeError);
        break; // Exit the loop in case of an error
      }

      console.log(`File ${uuidFolderStorage}/${databarulength} removed successfully.`);
      databarulength++;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { UploadProjectPicture, UpdateProjectPictureController };
