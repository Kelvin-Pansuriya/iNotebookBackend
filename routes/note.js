const express = require('express');
const Notes = require("../model/Notes")
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');
const router = express.Router()

// Router 1 :- Get All The Notes Using : GET Method (URL Path :- localhost:5000/api/notes/fetchallnotes) [LoggedIn Required....]
router.get("/fetchallnotes",fetchuser,async(req,res)=>{
    try{
        const notes = await Notes.find({user:req.userId.id})
        res.send(notes)
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Errors....")
    }
})

// Router 2 :- Add New Notes Using : POST Method (URL Path :- localhost:5000/api/notes/addnotes) [LoggedIn Required....]
router.post("/addnotes",fetchuser,[
    body("title","Enter Value For Title").isLength({min:3}),
    body("description","Enter Value For Description").isLength({min:5})
],async(req,res)=>{

    // This Condition Is Check Validation Errors....(For This Validators Package 'express-validator' )
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {title,description,tag} = req.body
        const notes = Notes({
            user:req.userId.id,
            title:title,
            description:description,
            tag:tag
        })
        const storedNotes = await notes.save()
        res.send(storedNotes)
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Errors....")
    }
})

// Router 3 :- Updating Notes Using : PUT Method (URL Path :- localhost:5000/api/notes/updatenotes/:id) [LoggedIn Required....]

router.put("/updatenotes/:id",fetchuser,[
    body("title","Enter Value For Title").isLength({min:3}),
    body("description","Enter Value For Description").isLength({min:5})
],async(req,res)=>{

    // This Condition Is Check Validation Errors....(For This Validators Package 'express-validator' )
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {title,description,tag} = req.body
        const putNotes = {}
        if(title){
            putNotes.title=title
        }
        if(description){
            putNotes.description=description
        }
        if(tag){
            putNotes.tag=tag
        }

        const notes = await Notes.findById(req.params.id)
        if(!notes){
            return res.status(404).send("404 Not Found")
        }

        if(notes.user.toString() !== req.userId.id){
            return res.status(401).send("Invalid User Not Allowed....")
        }

        const updatedNotes = await Notes.findByIdAndUpdate(req.params.id,{$set:putNotes},{new:true})
        res.send(updatedNotes)

    }catch(err){
        console.log(err);
        res.status(500).send("Internal Errors....")
    }
})

// Router 4 :- Delete Notes Using : DELETE Method (URL Path :- localhost:5000/api/notes/deletenotes/:id) [LoggedIn Required....]

router.delete("/deletenotes/:id",fetchuser,async(req,res)=>{
    try{
        const notes = await Notes.findById(req.params.id)
        if(!notes){
            return res.status(404).send("404 Not Found")
        }
        if(notes.user.toString() !== req.userId.id){
            return res.status(401).send("Invalid User Not Allowed....")
        }
        const deleteNotes = await Notes.findByIdAndDelete(req.params.id)
        res.send(deleteNotes)
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Errors....")
    }

})

module.exports = router