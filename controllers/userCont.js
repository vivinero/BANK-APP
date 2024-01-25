const userModel = require("../models/userModel") 
const bcrypt = require('bcrypt')
const {myValidate} = require('../utilities/validator')
const jwt = require('jsonwebtoken')
const RevokedToken = require('../models/revokedTokenModel')
// const cloudinary = require('../utilityMW/cloudinary.js')


exports.signUp = async (req, res)=>{
    try{
       const {firstname, lastname, phoneNumber, email, userPassword, confirmPassword, transactionPin} = req.body
    //    getting the image from the req.file(cloudinary)
    
    await myValidate.validateAsync(req.body,(err,data)=>{
        if (err) {
            return res.json("Validation Failed", err.message)
        } else {
            return  res.json(data) 
        
    }
    )

    // const file = req.file.path
    // const result = await cloudinary.uploader.upload(file)
    
    // // const checkPassword = confirmPassword === userPassword
    // console.log(req.body)
    if (confirmPassword !== userPassword) {
       return res.status(404).json({
       message:`incorrect Password, pls type-in a correct password that match`
       })
    }    

    // hash the user's transaction pin and password
       const salt = bcrypt.genSaltSync(10)
       const hashedPassword = bcrypt.hashSync(userPassword,salt)
       const hashedTransPin = bcrypt.hashSync(transactionPin,salt)
     
    // creating the user and mapping the req.body data to that of the database model
       const user = await new userModel({
        firstName:firstname.toUpperCase(),
        lastName:lastname.toUpperCase(),
        phoneNumber, 
        email: email.toUpperCase(),
        password: hashedPassword,
        transactionPin: hashedTransPin,
        accountNumber: phoneNumber.slice(1),
        // profileImage:result.secure_url,
        fullName: `${firstname.charAt(0).toUpperCase()}${firstname.slice(1)}.${lastname.slice(0, 1).toUpperCase()}`
      })
         
        // re-assigning the id of the user to the variable user.userId
        user.userId = user._id  

        //save the user data to the database
       await user.save()

        //   push the user's details to the jwt token
            const token = jwt.sign({
            userId: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
            accountNumber: user.accountNumber,
            }
            , process.env.secret, { expiresIn: '1d' });
             
       
 
            // return the success data
       return res.status(201).json({
        message: `Congratulations!!!, ${firstname.charAt(0).toUpperCase()}${firstname.slice(1)}.${lastname.slice(0, 1).toUpperCase()} you are successfully registered on FlipCash BANKING APP`,
        token,
         user
      })
    }catch(err){
        return res.status(500).json({
            error:err.message
        })
    }
}

exports.signIn = async (req, res) => {
    
    const {identifier, password } = req.body;    
    try {
        // Check if the identifier is an email or accountNumber 
        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        const isAcctNumber = /^\d{10}$/.test(identifier);
        
        
       

        if (!isEmail && !isAcctNumber) {
            return res.status(400).json({
                message: 'Invalid identifier. Please use a valid email or account number.'
            });
        }
        
        // Find user by email or accountNumber
        const user = await userModel.findOne({
            $or: [
                { email: isEmail ? identifier.toUpperCase() : '' },
                { accountNumber: isAcctNumber ? identifier : '' }
            ]
        });
        //    checking the user in the dataBase
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
           // comparing the user's password to that coming from the req.body 
        const comparePassword = bcrypt.compareSync(password, user.password);

        if (!comparePassword) {
            return res.status(400).json({
                message: 'Invalid password. Please type-in a correct password.'
            });
        }
            //   push the user's details to the jwt token
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
            accountNumber: user.accountNumber
            }
            , process.env.secret, { expiresIn: '1d' });
             

            // return the success message and the user's data
        return res.status(200).json({
            message: `Welcome ${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(1)}.${user.lastName.slice(0, 1).toUpperCase()}, Feel free to carry out fast and reliable banking transaction with our app`,
            token,
            data:user

        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}




// exports.signOut = async (req, res) => {
//     try{
//         const {userId, token} = req.user 
//         const user = await userModel.findById(userId);

//     if(!user){
//             return res.status(404).json({
//                 message: 'This user not found'
//             })
//         }
    
//         if (!user.token || user.token !== token) {
//             return res.status(400).json({
//                 message: 'User does not have a valid token'
//             });
//         }

//        // Revoke token by setting its expiration to a past date
//        const decodedToken = jwt.verify(user.token, process.env.secret);
//        decodedToken.exp = 1;

//    return res.status(200).json({
//         message: 'You have signed out successfully'
//     })
        
        
//     }catch(err){
//         return res.status(500).json({
//             message: err.message
//         })
//     }
// }


exports.signOut = async (req, res) => {
    try {
      const authorizationHeader = req.headers.authorization;
  
      if (!authorizationHeader) {
        return res.status(401).json({
          message: 'Missing token'
        });
      }
  
      const token = authorizationHeader.split(' ')[1];
  
      // Create a new revoked token entry and save it to the database
      const revokedToken = new RevokedToken({
        token: token
      });
  
      await revokedToken.save();
  
      res.status(200).json({
        message: 'User logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        Error: error.message
      });
    }
  };