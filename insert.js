// import { faker } from '@faker-js/faker';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const express = require('express');
const app = express();

 const createBlogs =async () => {
     const blogs = await prisma.blogs.create({
       data : {
         header: "Javascript",
        content : "javascript is the most popular language "
       }
     })
     console.log(blogs)
 }

 const createUser =async () => {
    const user = await prisma.user.create({
      data : {
        name: "david",
       email : "david@gmail.com",
       password : 123456
      }
    })
    console.log(user)
}

 createBlogs()
 createUser()