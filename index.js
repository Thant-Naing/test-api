
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const prisma = new PrismaClient();

const express = require('express');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('uploads'));
const port=3000;

const upload = multer({ dest: 'uploads/' });
const timeFormatter = (time) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });

      return formatter.format(time)
}

app.get("/blogs",async(req,res) => {                                        //get blogs

    const blogs = await prisma.blogs.findMany();
    res.json(blogs)
} )

const blogs_validate = [
    body("header").notEmpty().withMessage("Header is required").isLength({min: 3}).withMessage("Header must be at least 3 characters long"),
    body("content").notEmpty().withMessage("Content is required").isLength({min: 10}).withMessage("Header must be at least 10 characters long")
]

app.post("/blogs",blogs_validate,upload.single('image'), async (req,res) => {                         //create blogs
      
      const { header ,content} =  req.body;
      const imageUrl = req.file ? req.file.path : null;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() });

      } else {

        await prisma.blogs.create({
            data : {
              header: header,
             content :content,
             imageUrl : imageUrl
            }
          })

          res.status(200).json({
            message: 'blogs create successfully',
            data: { header , content },
          });
    
      }  

})



app.get("/user",async (req,res) => {                                                // get user
   
    if(res.status(200)){
        const allUser = await prisma.user.findMany();
    // res.json(user); 
    const users=[];
    allUser.forEach((u) => {
       
        const user = {
            name : u.name,
            email : u.email,
            password : u.password,
            createdAt : timeFormatter(u.createdAt),
            updatedAt : timeFormatter(u.updatedAt)
        }
        users.push(user)
         
    })
    
         res.json(users)
    
    } else {
        res.json({
            message: 'get user error',
            
          });
    }
  })

 
  app.post('/upload', upload.single('image'), async (req, res) => {                   //upload photo
    const { header, content } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    
    try {
      const newBlog = await prisma.blogs.create({
        data: {
          header,
          content,
          imageUrl,
        },
      });
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(500).json({ error: imageUrl });
    }
  });





app.listen(port, () => {
    console.log(" express running on port 3000")
})