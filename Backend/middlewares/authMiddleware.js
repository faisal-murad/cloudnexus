import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file


export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Verify the token using your secret or key
        const decoded = jwt.verify(token, 'secret_key');

        // Attach the decoded user information to the request
        req.user = decoded.user;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Token is not valid" });y
        
    }
};
