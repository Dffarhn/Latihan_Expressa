const { supabase } = require("../../config.js");

const SignupMemberController = async(req,res) =>{

    try {
        const {email,name,password,position} = req.body;

        console.log(req.body);

        const { data, error } = await supabase.auth.signUp({
         email: email,
         password: password,
         options :{
            data:{
            name : name,
            position : position}

         }

        })
        if (error) {

            throw error
        }

        res.status(201).send({ msg : "success signup", data: data })



        
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
        
    }
}



module.exports ={SignupMemberController}