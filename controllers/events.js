const express = require('express');
const Evento = require('../models/Evento')

const getEventos = async (req, res=express.response)=>{
    const eventos = await Evento.find().populate('user', 'name');
    
    
    res.json({
        ok:true,
        eventos
    })
}

const crearEvento = async (req, res=express.response)=>{
   const evento = new Evento(req.body);

   try {
        evento.user = req.uid;
        const eventoSaved = await  evento.save()

        res.json({
            ok:true,
            evento:eventoSaved
        })
   } catch (error) {
        console.log(error);
        res.json({
            ok:false,
            msg:'hable con el admin'
        })
   }
   
   
}

const actualizarEvento = async (req, res=express.response)=>{
  
    const eventId = req.params.id;

    try {
        const evento = await Evento.findById(eventId);  
        console.log(evento);     
        
        if(!evento){
            res.status(400).json({
                ok:false,
                msg:'el evento no existe por ese id'
            })
        }

        if(evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok:false,
                msg:'no tiene privilegio de editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user:req.uid
        }

        const eventUpdated = await Evento.findByIdAndUpdate(eventId, newEvent);
        res.json({
            ok:true,
            evento:eventUpdated
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        })
    }
}

const eliminarEvento = async (req, res=express.response)=>{
    
    const eventId = req.params.id;

    try {
        const evento = await Evento.findById(eventId);      
        
        if(!evento){
            res.status(400).json({
                ok:false,
                msg:'el evento no existe por ese id'
            })
        }
        if(evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok:false,
                msg:'no tiene privilegio de editar este evento'
            })
        }

        await Evento.findByIdAndDelete(eventId);
        res.json({
            ok:true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        })
    }
}


module.exports={
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
    
}