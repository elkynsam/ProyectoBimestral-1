import fs from "fs/promises";
import {join} from "path"

export const deleteFileOnError = async (err, req, res, next) =>{
    if(req.file && req.filePath){
        const filePath = join (req.filePath, req.file.filename);
        try{
            await fs.unlink(filePath)
        }catch(error){
            console.error("Error Deleting File: ", error)
        }
    }
    if(err.status == 400 || err.errrors){
        return res.status(400).json({
            success: false,
            error: err.errors
        })
    }
    return res.status(500).json({
        success: false,
        message: err.message
    })
}