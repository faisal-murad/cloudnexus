import User from "../database/modals/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from 'nodemailer';
import randomString from 'randomstring';
import { config } from "process";
import product from "../database/modals/product.js";
// controller for user registration

const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
        });

        const mailOptions = {
            from: 'test@openjavascript.info',
            to: email,
            subject: 'For Reset Password',
            html: '<p>Hi, ' + name + ' Please copy the link <a href="http://localhost:3025/api/user/forgot?token=' + token + '"> and reset your password</p></a>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);

            }
            else {
                console.log("Mail has been sent ", info.response);
            }
        })
    }
    catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

export const register = async (req, res, next) => {
    try {
        // extract email and password from request body
        const { name, email, password } = req.body;

        //hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user document with hash password
        const user = new User({ name, email, password: hashedPassword });

        // save the user documentto the database
        await user.save();

        // responce 
        res.status(201).json({
            email: user.email,
            message: "user register successfully",
            success: true,
            statusCode: 201

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "user registration failed",
            success: false,
            statusCode: 500
        });

    }
};


export const login = async (req, res) => {
    try {
        // extract email and password from request body
        const { email, password } = req.body;

        // find user by email in database
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            // const token = jwt.sign({ userId: user._id }, "secret-keys", {
            //     expiresIn: "1h",
            // });
            res.json({ 
                message: "Admin successful",
                token,
                success: true,
                statusCode: 200,
                admin: true
            });
        }
        else {

            const user = await User.findOne({ email });

            // if no user found, log an error and respond with a message
            if (!user) {
                console.error("Invalid credentials: User not found");
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // compare provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // if the password is invalid, log an error and respond with a message
            if (!isPasswordValid) {
                console.error("Invalid credentials: Either Email or Password is incorrect");
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // generate a JSON web Token for authentication
            const token = jwt.sign({ userId: user._id }, "secret-keys", {
                expiresIn: "1h",
            });

            // respond with success
            res.json({
                name: user.name,
                email: user.email,
                message: "Login successful",
                token,
                success: true,
                statusCode: 200,
                admin: false
            });
        }
    } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({
            error: "Login failed",
            success: false,
            statusCode: 500,
        });
    }
};

// controllers for change password
export const changePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields to update your account.",
            });
        }
        // find email in DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "no user found against this email",
            });
        }
        // check if old and new passwords are same or not
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "current password is incorrect",
            });
        }

        // hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update the new password 
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "your password has been updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
 

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 360000;

        console.log("Reset Token:", resetToken);
        await user.save();
        sendResetPasswordMail(user.name, user.email, resetToken)

        // send an email to the user with the reset token
        //nodemailer

        res.json({
            email: user.email,
            message: "Your password reset token sent to your mail",
        });
    } catch (error) {
        res.status(500).json({
            error: "forgot password request failed",
        });
    }
};

export const createCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity, name, number, size } = req.body;

        const userDB = await User.findById(user_id);
        const productItem = await product.findById(product_id);

        if (userDB && productItem) {

            const existingProduct = userDB.items.find(item =>
                item.name === name &&
                item.number.toString() === number.toString() &&
                item.product.toString() === product_id.toString() &&
                item.size === size
            );

            if (existingProduct) {
                console.log("The USER ID is:\n\n\n" + user_id + "\n\n");
                console.log("The Product ID is:\n\n\n" + product_id + "\n\n");

                const existingProductIndex = userDB.items.findIndex(item => item._id.toString() === existingProduct._id.toString());

                if (existingProductIndex !== -1) {
                    userDB.items[existingProductIndex].quantity += quantity;
                    const updatedUser = await userDB.save();

                    if (updatedUser) {
                        res.send(updatedUser);
                    } else {
                        console.log('Failed to update the user\'s cart.');
                        res.status(500).json({ error: "Failed to update the user's cart" });
                    }
                }
            } else {
                // If the product doesn't exist, add a new item to the cart
                userDB.items.push({ product: productItem, quantity, name, number, size });
                // Save changes to the user's document
                const updatedUser = await userDB.save();

                if (updatedUser) {
                    res.send(updatedUser);
                } else {
                    console.log('Failed to update the user\'s cart.');
                    res.status(500).json({ error: "Failed to update the user's cart" });
                }
            }


        } else {
            console.log("User or Product not found");
            res.status(404).json({ error: "User or Product not found" });
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Error adding item to cart" });
    }
};




export const deleteItem = async (req, res) => {
    const { userId, productId, name, number, size } = req.body;

    console.log(`\nuserId=${userId}\nproductId=${productId}\nname=${name}\nnumber=${number}\nsize=${size}`);

    try {
        const foundUser = await User.findById(userId);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const foundItemIndex = foundUser.items.findIndex((item) =>
            productId.toString() === item.product.toString() &&
            name === item.name &&
            number.toString() === item.number.toString() &&
            size === item.size
        );

        if (foundItemIndex !== -1) {
            // Remove the item from the array
            foundUser.items.splice(foundItemIndex, 1);

            // Save the updated user document
            const updatedUser = await foundUser.save();  // <-- Corrected variable name

            if (updatedUser) {
                res.json({ success: "Record deleted" });
            } else {
                console.log('Failed to update the user\'s cart.');
                res.status(500).json({ error: "Failed to update the user's cart" });
            }
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error("Error in deleteItem:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




export const findItems = async (req, res) => {

    const { user_id } = req.body;

    try {
        // Find user by ID
        const user = await User.findById(user_id);

        if (!user) {
            // Handle case where user is not found
            return res.status(404).json({ message: 'User not found' });
        }

        // Access the items array from the user document
        const items = user.items;

        // Send the items as a response or do further processing
        res.status(200).json({ items });
    } catch (error) {
        console.error('Error finding user items:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

export const FindOneUser = async (req, res) => {
    const { email } = req.body;

    try {
        const foundUser = await User.findOne({ email: email });
        if (foundUser) {
            res.send(foundUser);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error finding the user by email' });
    }
};
