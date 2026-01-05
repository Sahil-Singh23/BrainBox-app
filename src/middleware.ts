import type { NextFunction,Request,Response} from "express";
import jwt from "jsonwebtoken"


export default function authMiddleware(req: Request,res: Response,next: NextFunction){
    const token = req.headers["authorization"];
    const jwt_secret = process.env.jwt_secret;
    const decoded = jwt.verify(token as string,jwt_secret!) as{id: string};
    if(decoded){
        req.userId = decoded.id;
        next();
    }else{
        return res.status(403).json({message:"You are not logged in"});
    }

}