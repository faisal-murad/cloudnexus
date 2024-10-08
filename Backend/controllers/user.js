import User from "../database/modals/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from 'nodemailer';
import randomString from 'randomstring';
import { config } from "process";
import user from "../database/modals/user.js";
import { log } from "console";
// import { Server } from "http";
import Server from "../database/modals/server.js";
import mongoose from "mongoose";
import server from "../database/modals/server.js";
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
        const { firstname, lastname, email, password } = req.body;

        //hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user document with hash password
        const user = new User({ firstname, lastname, email, password: hashedPassword });

        // save the user documentto the database
        await user.save();

        // responce 
        res.status(201).json({
            // firstname: user.firstname,
            // email: user.email,
            user,
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
        // Extract relevant data from Google response
        console.log('req.body = ', req.body);
        // const { _id, given_name, family_name, email, picture } = req.body;
        const { userId } = req.user;
        console.log('userId = ', userId);

        // Find user by Google ID
        let user = await User.findOne({ _id: userId });

        // If user doesn't exist, create a new one
        if (!user) {
            user = new User({
                _id: userId,
                firstname: user.given_name,
                lastname: user.family_name,
                email: user.email,
                picture: user.picture
            });
            await user.save();
        }

        // Generate JWT token
        // const token = jwt.sign({ userId: user._id }, 'secret_key', {
        //     expiresIn: '1h'
        // });

        // Respond with success and the JWT token
        return res.json({
            user_id: user._id,
            firstname: user.firstname,
            lastname: user.family_name,
            SID: user.SID,
            email: user.email,
            picture: user.picture,
            message: "Login successful",
            // token,
            success: true,
            statusCode: 200
        });
    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({
            error: "Login failed",
            success: false,
            statusCode: 500,
        });
    }
};

// export const login = async (req, res) => {
//     try {
//         // extract email and password from request body
//         const { email, password } = req.body;

//         // find user by email in database
//         if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
//             // const token = jwt.sign({ userId: user._id }, "secret-keys", {
//             //     expiresIn: "1h",
//             // });
//             res.json({
//                 message: "Admin successful",
//                 token,
//                 success: true,
//                 statusCode: 200,
//                 admin: true
//             });
//         }
//         else {

//             const user = await User.findOne({ email });

//             // if no user found, log an error and respond with a message
//             if (!user) {
//                 console.error("Invalid credentials: User not found");
//                 return res.status(401).json({ error: "Invalid credentials" });
//             }

//             // compare provided password with the stored hashed password
//             const isPasswordValid = await bcrypt.compare(password, user.password);

//             // if the password is invalid, log an error and respond with a message
//             if (!isPasswordValid) {
//                 console.error("Invalid credentials: Either Email or Password is incorrect");
//                 return res.status(401).json({ error: "Invalid credentials" });
//             }

//             // generate a JSON web Token for authentication
//             const token = jwt.sign({ userId: user._id }, 'secret_key', {
//                 expiresIn: "1h",
//             });

//             // res.cookie('jwt',token,{
//             //     expires:new Date(Date.now() + 60 * 60 * 1000),
//             //     httpOnly:true
//             // });
//             // console.log("res cookie\n\n\n", res.cookie.jwt);
//             // respond with success
//             res.json({
//                 user_id: user._id,
//                 SID: user.SID,
//                 firstname: user.firstname,
//                 email: user.email,
//                 message: "Login successful",
//                 token,
//                 success: true,
//                 statusCode: 200,
//                 admin: false
//             });
//         }
//     } catch (error) {
//         console.error("Login failed:", error);
//         res.status(500).json({
//             error: "Login failed",
//             success: false,
//             statusCode: 500,
//         });
//     }
// };

// add google id in _id in mongodb, when logging in or inserting

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


export const FindOneUser = async (req, res) => {
    const { _id } = req.body;

    try {
        const foundUser = await User.findById({ _id:_id });
        if (foundUser) {
            res.send(foundUser);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error finding the user by email' });
    }
};


// export const addServer = async (req, res) => {
//     const { user_id, ipAddress, serverName, cpuUsage, memory, diskUsage, tag } = req.body;

//     const server = {
//         ipAddress,
//         serverName,
//         cpuUsage,
//         memory,
//         diskUsage,
//         tag
//     }



//     try {

//         const userDB = await User.findById(user_id);

//         if (userDB) {
//             userDB.servers.push(server);
//             const updatedUser = await userDB.save();

//             if (updatedUser) {
//                 res.send(updatedUser);
//             }
//             else {
//                 console.log('Failed to add server');
//                 res.status(500).json({ error: 'Failed to add server to user' });
//             }
//         }
//     }
//     catch (error) {
//         console.error("Error adding server to user:", error);
//         res.status(500).json({ error: "Error adding server to user" });
//     }

// }

// export const addServer = async (req, res) => {
//     const { user_id, ipAddress, serverName, tag, cpuUsage, memory, diskUsage } = req.body;

//     try {
//         // Create a new server document
//         const newServer = new Server({
//             ipAddress,
//             serverName,
//             cpuUsage,
//             memory,
//             diskUsage,
//             tag,
//             user: new mongoose.Types.ObjectId(user_id)  // Reference to the user
//         });

//         // Save the server to the database
//         const savedServer = await newServer.save();

//         // Update the user's servers array with the new server's _id
//         const updatedUser = await User.findByIdAndUpdate(
//             user_id,
//             { $push: { servers: savedServer._id } },
//             { new: true }
//         );

//         if (updatedUser) {
//             res.send(updatedUser);
//         } else {
//             console.log('Failed to add server');
//             res.status(500).json({ error: 'Failed to add server to user' });
//         }
//     } catch (error) {
//         console.error("Error adding server to user:", error);
//         res.status(500).json({ error: "Error adding server to user" });
//     }
// };


// export const getServers = async (req, res) => {
//     const { _id } = req.body;  // Change req.body to req.query for GET requests

//     try {
//         const userDB = await User.findOne({ _id });

//         if (userDB) {
//             // Assuming 'servers' is an array of server _ids in the User model
//             const servers = await Server.find({ UID: _id });

//             res.send(servers);
//         } else {
//             res.status(404).send({ message: 'User not found' });
//         }
//     } catch (error) {
//         console.error('Error finding user by email:', error);
//         res.status(500).send({ message: 'Error finding user by email' });
//     }
// }; 


export const getAllServers = async (req, res) => {
    const { user_id } = req.body;

    try {
        const userDB = await User.findOne({ _id: user_id });

        if (userDB) {
            // Get the server IDs for the user
            const serverIds = userDB.servers;

            // Fetch the latest server details and SID for each server
            const serversWithLatestDetails = await Promise.all(
                serverIds.map(async (serverId) => {
                    const server = await Server.findOne(
                        { _id: serverId },
                        { SID: 1, serverDetails: { $slice: -1 } }
                    );

                    return {
                        serverId: server._id,
                        SID: server.SID,
                        latestServerDetails: server?.serverDetails[0] || null,
                    };
                })
            );

            res.send(serversWithLatestDetails);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error finding user by _id:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getOneServer = async (req, res) => {
    const { UID, SID } = req.body;

    try {
        const server = await Server.findOne({ UID, SID });

        if (!server) {
            return res.status(404).json({ Error: "Server Not Found" });
        }

        return res.status(200).json({ server });
    }
    catch (error) {
        return res.status(500).json({ Error: "Internal Server Error", error });
    }
}



export const getLatestServer = async (req, res) => {
    const { user_id, SID } = req.body;

    try {
        const userDB = await User.findOne({ user_id });

        if (userDB) {
            const server = await Server.findOne(
                { UID: user_id, SID: SID },
                { serverDetails: { $slice: -1 } } // Get the last element of the array
            );

            if (server && server.serverDetails && server.serverDetails.length > 0) {
                const latestServerDetails = server.serverDetails[0];
                res.send(latestServerDetails);
            } else {
                res.status(404).send({ message: 'Server not found' });
            }
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error finding user by _id:', error);
        res.status(500).send({ message: 'Error finding user by _id' });
    }
};



export const addServer = async (req, res) => {
    try {
        const serverData1 = req.body;
        const serverData2 = serverData1.replace(/['\n\r+]/g, '');
        const serverData = JSON.parse(serverData2);

        // Find the existing user based on UID
        const user = await User.findOne({ _id: serverData.UID });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the existing server based on UID and SID
        const existingServer = await Server.findOne({ UID: serverData.UID, SID: serverData.SID });

        if (existingServer) {
            // Server exists, push the server details

            const toSave = {
                agent: serverData.agent,
                user: serverData.user,
                os: serverData.os,
                kernel: serverData.kernel,
                hostname: serverData.hostname,
                location: serverData.location,
                date: serverData.data,
                Vendor: serverData.Vendor,
                time: serverData.time,
                reqreboot: serverData.reqreboot,
                uptime: serverData.uptime,
                cpumodel: serverData.cpumodel,
                cpusockets: serverData.cpusockets,
                cpucores: serverData.cpucores,
                cputhreads: serverData.cputhreads,
                cpuspeed: serverData.cpuspeed,
                cpu: serverData.cpu,
                wa: serverData.wa,
                st: serverData.st,
                us: serverData.us,
                sy: serverData.sy,
                load1: serverData.load1,
                load5: serverData.load5,
                load15: serverData.load15,
                ramsize: serverData.ramsize,
                ram: serverData.ram,
                ramswapsize: serverData.ramswapsize,
                ramswap: serverData.ramswap,
                rambuff: serverData.rambuff,
                ramcache: serverData.ramcache,
                totalusers: serverData.totalusers,
                totalstorage: serverData.totalstorage,
                macaddress: serverData.macaddress,
                disks: serverData.disks,
                inodes: serverData.inodes,
                iops: serverData.iops,
                nics: serverData.nics,
                ipv4: serverData.ipv4,
                ipv6: serverData.ipv6,
                conn: serverData.conn,
                temp: serverData.temp,
                serv: serverData.serv,
                cust: serverData.cust


            }


            existingServer.serverDetails.push(toSave);
            await existingServer.save();
        } else {
            // Server doesn't exist, create a new server
            const toSave = {
                SID: serverData.SID,
                UID: serverData.UID,
                serverDetails: [{

                    agent: serverData.agent,
                    user: serverData.user,
                    os: serverData.os,
                    kernel: serverData.kernel,
                    hostname: serverData.hostname,
                    location: serverData.location,
                    date: serverData.data,
                    Vendor: serverData.Vendor,
                    time: serverData.time,
                    reqreboot: serverData.reqreboot,
                    uptime: serverData.uptime,
                    cpumodel: serverData.cpumodel,
                    cpusockets: serverData.cpusockets,
                    cpucores: serverData.cpucores,
                    cputhreads: serverData.cputhreads,
                    cpuspeed: serverData.cpuspeed,
                    cpu: serverData.cpu,
                    wa: serverData.wa,
                    st: serverData.st,
                    us: serverData.us,
                    sy: serverData.sy,
                    load1: serverData.load1,
                    load5: serverData.load5,
                    load15: serverData.load15,
                    ramsize: serverData.ramsize,
                    ram: serverData.ram,
                    ramswapsize: serverData.ramswapsize,
                    ramswap: serverData.ramswap,
                    rambuff: serverData.rambuff,
                    ramcache: serverData.ramcache,
                    disks: serverData.disks,
                    inodes: serverData.inodes,
                    iops: serverData.iops,
                    nics: serverData.nics,
                    ipv4: serverData.ipv4,
                    ipv6: serverData.ipv6,
                    conn: serverData.conn,
                    temp: serverData.temp,
                    serv: serverData.serv,
                    cust: serverData.cust,
                    totalusers: serverData.totalusers,
                    totalstorage: serverData.totalstorage,
                    macaddress: serverData.macaddress,
                }]


            }

            // Create a new server document
            const server = new Server(toSave);
            // Update the user's servers array with the new server's _id
            const updatedUser = await User.findByIdAndUpdate(
                serverData.UID,
                { $push: { servers: server._id } },
                { new: true }
            );

            // Save both the server and user documents
            // await Promise.all([server.save(), updatedUser.save()]);
            // user.servers.push(new mongoose.Types.ObjectId(server._id));
            await updatedUser.save();

            await server.save();
            // user.servers.push(server._id);
            // await user.save();

            // Save the new server document
        }

        res.status(201).json({ message: 'Server data saved successfully' });
    } catch (error) {
        console.error('Error in storing server data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const installServer = async (req, res) => {
    try {
        const serverData1 = req.body;
        console.log("serverData1", serverData1);

        const serverData2 = serverData1.replace(/['\n\r+]/g, '');
        const serverData = JSON.parse(serverData2);

        // Check if the received status is "200"
        if (serverData.status == '200') {
            // Find the user by UID
            // const user = await User.findById(new mongoose.Types.ObjectId(serverData.UID)); 
            const user = await User.findById(serverData.UID);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Convert the user's SID to a number, add 1, and save it back as a string
            user.SID = (parseInt(user.SID, 10) + 1).toString();

            // Save the updated user
            await user.save();

            return res.status(200).json({ message: 'User SID updated successfully' });
        } else {
            return res.status(400).json({ error: 'Invalid status code' });
        }
    } catch (error) {
        console.error('Error updating user SID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const uninstallServer = async (req, res) => {
    try {
        const serverData1 = req.body;
        console.log("serverData1", serverData1);

        const serverData2 = serverData1.replace(/['\n\r+]/g, '');
        const serverData = JSON.parse(serverData2);

        // Check if the received status is "200"
        if (serverData.status == '200') {
            // Find the server by UID and SID
            const server = await Server.findOne({ UID: serverData.UID, SID: serverData.SID });

            if (!server) {
                return res.status(404).json({ error: 'Server not found' });
            }
            // Store the _id of the server
            const serverId = server._id;

            const result = await Server.deleteOne({ UID: serverData.UID, SID: serverData.SID });
            console.log("after deleting server:", result);

            // Find the user by UID
            const user = await User.findById(new mongoose.Types.ObjectId(serverData.UID));

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // user.SID = (parseInt(user.SID, 10) - 1).toString();
            // Find the index of the server entry in the user's servers array
            const serverIndex = user.servers.findIndex(server => server.equals(serverId));

            // Remove the server entry from the user's servers array
            user.servers.splice(serverIndex, 1);

            // Save the updated user
            await user.save();

            return res.status(200).json({ message: 'User SID and server deleted successfully' });
        } else {
            return res.status(400).json({ error: 'Invalid status code' });
        }
    } catch (error) {
        console.error('Error updating user SID and deleting server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const checkSid = async (req, res) => {
    const user_id = req.body.user_id;
    try {
        const foundUser = await User.findById({ _id: user_id });
        if (!foundUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const Sid = foundUser.SID;

        return res.status(200).json({ SID: Sid });

    }
    catch (err) {
        console.error('Error Fetching SID:', err);
        return res.status(500).json({ error: 'Internal Server Error(checkSID)' })
    }
}


export const getRecentRecords = async (req, res) => {
    const UID = req.body.UID;
    const SID = req.body.SID;

    try {


        // Find the server document by SID (replace 'your_sid' with the actual SID) 
        const server = await Server.findOne({ UID: UID, SID: SID });

        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Extract the serverDetails array from the server document
        const serverDetails = server.serverDetails.reverse();


        // Get the first five records (most recent)
        const mostRecentRecords = serverDetails.slice(0, 5);

        // Respond with the most recent records as JSON
        res.json(mostRecentRecords);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const getThreshold = async (req, res) => {
    const UID = req.body.UID;
    const SID = req.body.SID;

    try {


        // Find the server document by SID (replace 'your_sid' with the actual SID) 
        const server = await Server.findOne({ UID: UID, SID: SID });

        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Extract the serverDetails array from the server document
        const cpuThreshold = server.cpuThreshold;
        const ramThreshold = server.ramThreshold;

        const toSend = {
            cpuThreshold,
            ramThreshold
        }

        // Respond with the most recent records as JSON
        res.json(toSend);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const deleteServer = async (req, res) => {
    const user_id = req.params.id;
    try {
        // Attempt to delete the record using the _id field
        const result = await User.deleteOne({ _id: user_id });

        if (result.deletedCount === 1) {
            res.json({ success: "Record deleted" });
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const updateThreshold = async (req, res) => {
    const { cpuThreshold, ramThreshold, user_id, SID } = req.body;

    try {
        const user = User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not Found" });
        }
        const myserver = await Server.findOne({ SID: SID, UID: user_id });

        if (!myserver) {
            return res.status(400).json({ error: "Server not Found" });
        }

        // Update the cpuThreshold property
        myserver.cpuThreshold = cpuThreshold;
        myserver.ramThreshold = ramThreshold;

        // Save the changes to the server
        await myserver.save();

        // Send a success response
        return res.status(200).json({ success: "CpuThreshold updated successfully" });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const logoutUser = async (req, res) => {
    try {
        // Logout the user
        req.logout();

        // Optionally, you can respond with a JSON message indicating successful logout
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



 
export const sendMail = async (req, res) => {
    const { from, to, subject, text, html } = req.body;
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });
    
    const mailOptions = { 
        from: {
            name: 'CLOUDNEXUS',
            address: from || process.env.SENDER_EMAIL,
        },
        to: to || "faisalmurad.baloch@gmail.com",
        subject: subject || "Nah man",
        text: text || "Camera wowo",
        html: html || "<a href='www.google.com'>Hello world?</a>",
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent successfully");
        res.status(200).send({ message: 'Email sent successfully' });
    } catch(error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
}
export const getAllUsersAndServers = async (req, res) => {
    try {
        // Retrieve all users
        const users = await User.find();

        // Iterate over each user
        for (const user of users) {
            // Retrieve all servers for the current user
            const servers = await Server.find({ UID: user._id });

            // Iterate over each server
            for (const server of servers) {
                // Check if serverDetails array is empty
                if (!server.serverDetails || server.serverDetails.length === 0) {
                    continue; // Skip if no server details available
                }

                // Get the latest server details
                const latestDetails = server.serverDetails[server.serverDetails.length - 1];

                // Check if latestDetails object is defined
                if (!latestDetails) {
                    continue; // Skip if latestDetails is undefined
                }

                // Check if CPU and RAM thresholds are exceeded
                if (latestDetails.cpu > server.cpuThreshold || latestDetails.ram > server.ramThreshold) {
                    // If thresholds exceeded, handle notification here (e.g., sending email)
                    console.log(`Thresholds exceeded for server ${server.SID} of user ${user._id}`);
                    // {
                    //     "subject":"Hello Biatch",
                    //     "html":"<a href='https://www.google.com/search?q=hello+biatch+jesse+pinkman&client=opera&hs=19I&sca_esv=41437dda0f3602d3&tbm=isch&sxsrf=ACQVn08uxR1-3dahwGkdGjD3B9twtIYGzA:1706644106442&source=lnms&sa=X&ved=2ahUKEwjQuuPd8IWEAxX-2wIHHcXEAOIQ_AUoAXoECAQQAw&biw=1482&bih=698&dpr=1.25#imgrc=_9ZXE5dId65JIM'>Click</a>",
                    //     "to":"rgsbaloch@gmail.com"
                    // }
                    console.log('STTSSFSDfsdjijfj ', user.email)

                    // const mailOptions = {
                    //     from: process.env.SENDER_EMAIL,
                    //     subject: "Threshold Exceeded",
                    //     html: "Thresholds exceeded for the server.",
                    //     to: user.email // Adjust recipient email address
                    // };
 
                    // await sendMail(mailOptions); 
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.SENDER_EMAIL,
                            pass: process.env.APP_PASSWORD,
                        },
                    });
                    
                    const mailOptions = { 
                        from: {
                            name: 'CLOUDNEXUS',
                            address: process.env.SENDER_EMAIL,
                        },
                        to: user.email, 
                        subject: "Nah man",
                        text: "Camera wowo",
                        html: "<a href='www.google.com'>Hello world?</a>",
                    };
                
                    try {
                        await transporter.sendMail(mailOptions);
                        console.log("Email has been sent successfully");
                        // res.status(200).send({ message: 'Email sent successfully' });
                    } catch(error) {
                        console.error(error);
                        res.status(500).send({ message: 'Internal server error' });
                    }
                }
            }
        }

        res.status(200).json({ message: 'Threshold checking complete' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
