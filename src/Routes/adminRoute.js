import express from 'express'
import User from '../Models/userModel.js';
import Admin from '../Models/adminModel.js';
import DoctorApplication from '../Models/requestedDoctorModel.js';
import HealthPackage from '../Models/healthPackageModel.js';
import protect from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = express.Router()

//requirement number 7
router.post('/createAdmin', async (req, res) => {
    // Create the admin
    try {
        const { Username, Password } = req.body;
        if (!Username || !Password) {
            return res.status(500).json({
                success: false,
                message: "Please enter username and password"
            });
        }
        const userexist = await Admin.findOne({ Username });
        if (!userexist) {
            const salt = await bcrypt.genSalt(10);
            console.log(Password);
            const hashedPassword = await bcrypt.hash(Password, salt)
            const admin = new Admin({
                Username: Username,
                Password: hashedPassword
            });
            const savedAdmin = await admin.save();

            let savedAdminResult = JSON.parse(JSON.stringify(savedAdmin));
            savedAdminResult["token"] = generateToken(savedAdmin._id);

            res.status(200).json({
                message: 'Admin created successfully',
                success: true,
                Result: savedAdminResult
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Username already exist'
            });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: "General Error"
        })
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

//requirement number 8
router.delete('/deleteUser/:username', protect, async (req, res) => {
    try {
        const exist = await Admin.findById(req.user);
        if (!exist) {
            return res.status(500).json({
                success: false,
                message: "You are not an admin"
            });
        }
        const username = req.params.username;
        const user = await User.findOne({ Username: username });
        console.log(user)
        if (user) {
            await User.deleteOne(user);
            const users = await User.find({});
            res.status(200).json({
                success: true,
                deletedUser: user,
                usersLeft: users,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "User doesn't exist"
            });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: "General Error"
        })
    }
});

//requirement number 9
router.get('/viewDoctorApplications', protect, async (req, res) => {
    try {
        const exist = await Admin.findById(req.user);
        if (!exist) {
            return res.status(500).json({
                success: false,
                message: "You are not an admin"
            });
        }
        const doctorApplications = await DoctorApplication.find({});
        if (doctorApplications) {
            res.status(200).json({
                success: true,
                doctorApplications: doctorApplications
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "No doctor applications found"
            });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: "General Error"
        })
    }
});


//requirement number 10
router.post('/addHealthPackage', protect, async (req, res) => {
    const newPackage = req.body.healthPackage;
    const packageType = newPackage.packageType;
    try {
        const exist = await Admin.findById(req.user);
        if (!exist) {
            return res.status(500).json({
                success: false,
                message: "You are not an admin"
            });
        }
        const existingPackage = await HealthPackage.findOne({ packageType: packageType });
        if (existingPackage) {
            res.status(500).json({
                success: false,
                message: "This package already exists"
            });
        } else {
            const heathPackage = new HealthPackage({
                packageType: packageType,
                subsriptionFeesInEGP: newPackage.subsriptionFeesInEGP,
                doctorDiscountInPercentage: newPackage.doctorDiscountInPercentage,
                medicinDiscountInPercentage: newPackage.medicinDiscountInPercentage,
                familyDiscountInPercentage: newPackage.familyDiscountInPercentage
            });
            heathPackage.save();
            res.status(200).json({
                success: true,
                healthPackage: heathPackage
            });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: "General Error"
        })
    }
});


//requirement number 10
router.put('/updateHealthPackage', protect, async (req, res) => {
    const packageType = req.body.healthPackage.packageType;
    try {
        const exist = await Admin.findById(req.user);
        if (!exist) {
            return res.status(500).json({
                success: false,
                message: "You are not an admin"
            });
        }
        const existingPackage = await HealthPackage.findOne({ packageType: packageType });
        let newPackage = req.body.healthPackage
        if (existingPackage) {
            await HealthPackage.findByIdAndUpdate(existingPackage._id, newPackage);
            res.status(200).json({
                success: true,
                updatedHealthPackage: newPackage
            });
        } else {
            res.status(500).json({
                success: false,
                message: "This package doesn't exist"
            });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: "General Error"
        })
    }
});


//requirement number 10
router.delete('/deleteHealthPackage', protect, async (req, res) => {
    const packageType = req.body.packageType;
    try {
        const exist = await Admin.findById(req.user);
        if (!exist) {
            return res.status(500).json({
                success: false,
                message: "You are not an admin"
            });
        }
        const existingPackage = await HealthPackage.findOne({ packageType: packageType });
        if (existingPackage) {
            await HealthPackage.deleteOne({ packageType: packageType });
            res.status(200).json(
                {
                    success: true,
                    deletedHealthPackage: existingPackage
                });
        } else {
            res.status(500).json({
                success: false,
                message: "This package doesn't exist"
            });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: "General Error"
        })
    }
});

//requirement number 10
router.get('/viewHealthPackages', protect, async (req, res) => {
    try {
        const exist = await Admin.findById(req.user);
        if (!exist) {
            return res.status(500).json({
                success: false,
                message: "You are not an admin"
            });
        }
        const packages = await HealthPackage.find({});
        if (packages) {
            res.status(200).json(
                {
                    success: true,
                    packages: packages
                });
        } else {
            res.status(500).json({
                success: false,
                message: "No Packages Available"
            });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: "General Error"
        })
    }
});

router.get('/fetchUsers', protect, async (req, res) => {
    try {
        const exist = await Admin.findById(req.user);
        if (!exist) {
            return res.status(500).json({
                success: false,
                message: "You are not an admin"
            });
        }
        const users = await User.find(({ '__t': { $ne: "RequestedDoctor" } }));
        res.status(200).json({
            success: true,
            users: users,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users.',
        });
    }
});


export default router;