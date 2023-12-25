import { validationResult } from "express-validator"
export const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
}

// check if specific fields are empty and add custom error message
const {email, password } = req.body;

if(!email || email.trim() === '') {
    return res.status(400).json({ errors: [{msg: 'Email is required'}] });
}
if(!password || password.trim() === '') {
    return res.status(400).json({ errors: [{msg: 'Password is required'}] });
}

next();
};