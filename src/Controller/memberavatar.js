
const {  prisma } = require("../../config.js");




const InsertAvatarMemberController = async (req, res,next) => {

    try {
        if (!req.file) {


          next()
        }else{

            // Convert the uploaded file (Buffer) to bytea data
            const imageData = req.file.buffer;
    
        
            // Save the bytea data to the database using Prisma
            const savedImage = await prisma.images.create({
              data: {
                name: req.file.originalname,
                data: imageData,
              },
            });
    
            req.avatarfile = savedImage.id
    
            next()
        }
    
    
        // res.status(200).send({ msg: 'Image uploaded successfully', data: savedImage });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
}


module.exports= {InsertAvatarMemberController}