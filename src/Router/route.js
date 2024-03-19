const express = require("express");
const multer = require("multer");
const { Router } = require("express");
const { prisma } = require("../../config.js");
const cors = require("cors");

const { AddProjectController, GetAllProjectController, GetOneProjectController, UpdateProjectController, DeleteProjectController } = require("../Controller/project.js");
const { GetAllMemberController, GetMemberController, UpdateMemberController, AddMemberController } = require("../Controller/member.js");
const { InsertAvatarMemberController } = require("../Controller/memberavatar.js");
const { UploadProjectPicture, UpdateProjectPictureController } = require("../Controller/projectpicture.js");
const { SignupMemberController } = require("../Controller/sign_member.js");
const cookieParser = require("cookie-parser");

const { VerifyMemberController } = require("../Controller/verifyMember.js");
const { getImageData, convertByteaToBase64 } = require("../model/getImageData.js");

const route = Router();
// Set up multer storage

route.use(cors());
route.use(cookieParser());

route.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//all about member
route.get("/members", GetAllMemberController);
route.get("/member/:member_id", GetMemberController);
// route.post('/upload-member-avatar', checkAuthSession, upload.single('avatar'),InsertAvatarMemberController)
route.patch("/member/:member_id", upload.single("avatar"), InsertAvatarMemberController, UpdateMemberController);
route.post("/member", AddMemberController);

route.get("/verify",VerifyMemberController);

//masalah sign_in dan sign_out

route.post("/signin_member", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Cari anggota dengan email dan password yang cocok
      const signInUser = await prisma.kahlova_Member.findUnique({
        where: {
          email: email,
          password: password,
        },
      });
  
      // Jika user berhasil ditemukan, kirim respons sukses
      if (signInUser) {
        res.cookie('user', signInUser.id, { maxAge: 9000, httpOnly: true });
        res.status(200).send({ msg: "Success login", data: signInUser });
      } else {
        res.status(401).send({ msg: "Invalid email or password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Internal Server Error" });
    }
  });

route.get("/signout-member", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Handle the error, send an appropriate response, or redirect
      console.error("Sign-out error:", error);
      return res.status(500).json({ error: "Failed to sign out" });
    }

    // Successful sign-out
    return res.status(200).json({ message: "Sign out successful" });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Unexpected error during sign-out:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// route.get('/signup_berhasil',async (req, res) => {

// })

//all about project
route.get("/projects", GetAllProjectController);

route.get("/project/:project_id", GetOneProjectController);

// route.post('/project',upload.array('project',5), AddProjectController)
route.post("/project", upload.array("project", 5), UploadProjectPicture, AddProjectController);

route.patch("/project/:project_id", upload.array("projectupdate", 5), UpdateProjectPictureController, UpdateProjectController);

route.delete("/project/:project_id", DeleteProjectController);


route.get('/avatar/:id', async (req, res) => {
  const { id } = req.params;
  const imageData = await getImageData(id);

  if (!imageData) {
    return res.status(404).send('Image not found');
  }

  const base64ImageData = convertByteaToBase64(imageData);;

  // Set appropriate Content-Type header for the image type (e.g., 'image/jpeg', 'image/png', etc.)
  res.setHeader('Content-Type', 'image/jpeg');
  res.send(Buffer.from(base64ImageData, 'base64'));
});
 
  
  

module.exports = { route };
