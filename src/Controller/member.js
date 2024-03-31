const { prisma } = require("../../config.js");
const { client } = require("../../configredis.js");
const { DEFAULT_EXPIRED } = require("../Middleware/Redis/configuration_redist.js");
const { sendVerificationEmail } = require("../model/ConfirmationEmail.js");

const { v4 } = require("uuid");
const GetAllMemberController = async (req, res) => {
  try {
    console.log("Loading");
    const key = req.originalUrl;

    const alldata = await prisma.kahlova_Member.findMany();
    await client.set(key, JSON.stringify(alldata), { ex: DEFAULT_EXPIRED });

    res.status(200).send({ msg: "success mengambil data member ", data: alldata });
  } catch (error) {
    res.status(500).send({ msg: "internal server error", err: error });
  }
};

const GetMemberController = async (req, res) => {
  try {
    const memberid = req.params.member_id;

    const memberdata = await prisma.kahlova_Member.findUnique({
      where: {
        id: parseInt(memberid, 10),
      },
    });

    res.status(200).send({ msg: "berhasil mengambil member", data: memberdata });
  } catch (error) {
    res.status(500).send({ msg: "gagal mengambil member" });
  }
};

const AddMemberController = async (req, res) => {
  try {
    const newuser = req.body;
    const verification = v4();

    await sendVerificationEmail(newuser.email, verification);

    const AddUserToDB = await prisma.kahlova_Member.create({
      data: {
        name: newuser.name,
        email: newuser.email,
        password: newuser.password,
        positionid: newuser.position,
        verification_token: verification,
      },
    });

    res.status(200).send({ msg: "Member created", data: AddUserToDB });
  } catch (error) {
    res.status(500).send({ msg: "internal error", why: error });
  }
};

const UpdateMemberController = async (req, res) => {
  try {
    const memberId = req.params.member_id;
    const { newname, newposition } = req.body;

    const avatarfile = req.avatarfile;

    // Persiapkan data untuk update
    const updateData = {
      ...(newname && { name: newname }), // Jika newname tidak kosong, tambahkan field name ke updateData
      ...(newposition && { position: parseInt(newposition, 10) }), // Jika newposition tidak kosong, tambahkan field position ke updateData
      ...(avatarfile && { avatar: avatarfile }),
    };

    // Lakukan update menggunakan Prisma
    const updatedMember = await prisma.kahlova_Member.update({
      where: { id: parseInt(memberId) }, // Ubah id menjadi tipe yang sesuai dengan skema Prisma Anda
      data: updateData,
    });

    // Kirim respons jika update berhasil
    res.status(200).json({ msg: "Member updated successfully", data: updatedMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { GetAllMemberController, GetMemberController, UpdateMemberController, AddMemberController };
