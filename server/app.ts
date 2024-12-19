require("dotenv").config();
import express,{NextFunction, Request, Response} from "express"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route";
import cors from "cors"


export const app = express()


// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5000', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));


//body parser
app.use(express.json({limit: "50mb"}))


//cookie parser
app.use(cookieParser());

//routes
app.use("/api/v1", userRouter)

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction)=>{
    res.status(200).json({
        success: true,
        message: "API is working"
    })
})
