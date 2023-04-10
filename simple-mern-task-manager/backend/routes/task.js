const Task = require("../models/Task");
const util = require('util');
const router = require("express").Router();
const mongoose = require('mongoose');

// GET all tasks
router.get("/tasks", async (req, res) => {
    try{
        const tasks = await Task.find()
        console.log("All Tasks from Server", tasks) 
        res.status(200).json(tasks)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
});

// Creating new task
router.post("/task", async (req, res) => {
    const task = new Task({
        
        text: req.body.text,
        title: req.body.title
    });

    try{
        const newTask = await task.save();        
        res.status(201).json(newTask)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
});
// updating new task
router.put("/task", async (req, res) => {
    console.log(" Body", req.body);
    const task = new Task({
        _id: req.body._id,
        text: req.body.text,
        title: req.body.title
    });
    console.log(" Updating Task at Server", task);
    try{
        await task.updateOne(task);        
        res.status(200).json(task)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
});
//getting a task
router.get("/task/:_id", async (req, res) => {

        try{
            const task = await Task.findById(new mongoose.Types.ObjectId(req.params._id));
            console.log("Task Get from Server", task);
            res.status(200).json(task)
        }catch(err){
            res.status(500).json(err)
        }
});
//deleting a task
router.delete("/task/:_id", async (req, res) => {
    
    try{
        const task = await Task.findById(new mongoose.Types.ObjectId(req.params._id));
        console.log("Task Delete from Server", task);
        await Task.findByIdAndRemove(new mongoose.Types.ObjectId(req.params._id));
        res.status(204).json(task)
    }catch(err){
        res.status(500).json(err)
    }
});
module.exports = router;