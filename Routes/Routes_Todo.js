const express = require('express');


const auth = require('../middleware/user_jwt');

const Todo = require('../models/Models_Todo');
const { route } = require('./Routes_user');

const router = express.Router();

// Create new todo task


router.post('/',auth,async (req,resp,next)=>{
    try{
        const toDo = await Todo.create({title:req.body.title,description:req.body.description,user:req.user.id});

        if(!toDo){
            return resp.status(400).json({
                success:false,
                msg:'Something went wrong'
            });
        }


        resp.status(200).json({
            success:true,
            Todo : toDo,
            msg:'Successfully Created'
        });
    }catch(error){
        next(error);
    }
});


// fetch all to dos

router.get('/',auth,async (req,resp,next)=>{
    try{    
        const todo = await Todo.find({user:req.user.id,finished:false});
        console.log(todo);

        if(!todo){
            return resp.status(400).json({
                success:false,
                msg:'Something error'
            });
        }

        

        resp.status(200).json({
            success:true,
            todos:todo,
            msg:'Successfully fetched'
        });

    }catch(error){
        next(error);
    }
});


router.put('/:id',async (req,resp,next)=>{
    try{
        let toDo = await Todo.findById(req.params.id);

        if(!toDo){
            return resp.status(400).json({
                success:false,
                msg:'Task Todo not exists'
            });
        }

        toDo = await Todo.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        if(!toDo){
            return resp.status(400).json({
                success:false,
                msg:'Something went wrong'
            });
        }


        resp.status(200).json({
            success:true,
            msg:'Successfully Updated'
        });
    }catch(error){
        next(error);
    }
});



router.delete('/:id',async (req,resp,next)=>{
    try{
        let toDo = await Todo.findById(req.params.id);

        if(!toDo){
            return resp.status(400).json({
                success:false,
                msg:'Task Todo not exists'
            });
        }

        toDo = await Todo.findByIdAndDelete(req.params.id);

        resp.status(200).json({
            success:true,
            msg:'Successfully Deleted Task'
        });
    }catch(error){
        next(error);
    }
});



// for finished Fragment


router.get('',auth,async (req,resp,next)=>{
    try{    
        const todo = await Todo.find({user:req.user.id,finished:true});
        console.log(todo);

        if(!todo){
            return resp.status(400).json({
                success:false,
                msg:'Something error'
            });
        }

        

        resp.status(200).json({
            success:true,
            todos:todo,
            msg:'Successfully fetched'
        });

    }catch(error){
        next(error);
    }
});


module.exports = router;



