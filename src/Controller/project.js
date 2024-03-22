const { prisma } = require("../../config.js");

const GetAllProjectController = async (req, res) => {
    try {
      const { kategori, sort } = req.query;
  
      let query = {
        include: {
          // Include any related tables if needed
        },
      };
  
      if (kategori) {
        query = {
          ...query,
          where: {
            categori: kategori, // Filter by category
          },
        };
      }
  
      if (sort) {
        if (sort === "true") {
          query = {
            ...query,
            orderBy: {
              created_at: "asc", // Sort by created_at in ascending order
            },
          };
        } else {
          query = {
            ...query,
            orderBy: {
              created_at: "desc", // Sort by created_at in descending order
            },
          };
        }
      }
  
      const allProjects = await prisma.kahlova_Project.findMany(query);
      console.log(kategori)
      res.status(200).send({ msg: "Successfully retrieved all projects", data: allProjects });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  

const GetOneProjectController = async (req, res) => {
  try {
    const idproject = req.params.project_id;
    
    const AProject = await prisma.kahlova_Project.findUnique({
        where:{
            id: idproject
        }
    })

    res.status(200).send({ msg: "berhasil ambil data satu project", data: AProject });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const AddProjectController = async (req, res) => {
  try {
    const { namaproject, deskripsiproject, kategoriproject, techmade } = req.body;

    const project_picture = req.avatarfile;

    console.log(namaproject,deskripsiproject,kategoriproject,techmade)



    const addProjectToDB = await prisma.kahlova_Project.create({
      data:{

      name: namaproject,
      bio: deskripsiproject,
      categori: kategoriproject,
      project_picture: [project_picture],
      techmade: [techmade],
        

      }
    })

    res.status(201).send({ msg: "success create new project", data: addProjectToDB });
  } catch (error) {
    res.status(500).send({ msg: "error creating project" });
  }
};

const UpdateProjectController = async (req, res) => {
  try {
    const id = req.params.project_id;

    const { newname, newdeskripsi, newkategori, newtechmade } = req.body;
    const newproject_picture = req.update_picture;

    console.log(newproject_picture);

    const updateproject = {
      ...(newname !== undefined && { name: newname }),
      ...(newdeskripsi !== undefined && { deskripsi: newdeskripsi }),
      ...(newkategori !== undefined && { kategori: newkategori }),
      ...(newproject_picture !== undefined && { foto_project: newproject_picture }),
      ...(newtechmade !== undefined && { foto_project: newtechmade }),
    };

    const { data, error } = await supabase.from("kahlova_project").update(updateproject).eq("id", id);

    if (error) {
      throw error;
    }

    res.status(201).send({ msg: "success update", data: data });
  } catch (error) {
    res.status(500).send({ msg: "error updating" + error });
  }
};

const DeleteProjectController = async (req, res) => {
  try {
    const { id } = req.params.project_id;

    // Fetch project photos
    const { data: projectData, error: project } = await supabase.from("kahlova_project").select("foto_project").eq("id", id);

    // Delete photos from storage
    await Promise.all(
      projectData[0].foto_project.map(async (photo) => {
        await supabase.storage.from("project_picture").remove(photo);
      })
    );

    // Delete project record
    const { data: deletedProject, error: deletedProjectError } = await supabase.from("kahlova_project").delete().eq("id", id);
    if (deletedProjectError) {
      throw deletedProjectError;
    }

    res.status(200).send({ msg: "Deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({ msg: "Internal server error" });
  }
};

module.exports = { GetAllProjectController, GetOneProjectController, AddProjectController, UpdateProjectController, DeleteProjectController };
