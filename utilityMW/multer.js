const multer = require('multer')


const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './uploads')
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image/')){
       cb(null, true) 
    }
    else{
        cb(new Error('file type not supported, file must be an image', false))
    }
}

const fileSize = ({
    limits: 10* 10 * 1024
})

const upload = multer({
    storage,
    fileFilter,
    limit:fileSize
}) 

module.exports = upload
