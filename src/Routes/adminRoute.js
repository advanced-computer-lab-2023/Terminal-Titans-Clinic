import express from 'express'
import User from '../Models/userModel.js';
import Admin from '../Models/adminModel.js';
import DoctorApplication from '../Models/requestedDoctorModel.js';
import HealthPackage from '../Models/healthPackageModel.js';

const router = express.Router()

//requirement number 7
router.post('/createAdmin', async (req, res) => {
    // Create the admin
    try {
        const { Username, Password } = req.body;
        const userexist = await Admin.findOne({ Username });
        if (!userexist) {
            const admin = new Admin({ Username, Password });
            const savedAdmin = await admin.save();
            res.status(200).json({
                success:true,
                savedAdmin:savedAdmin});
        }
        else {
            res.status(500).json({ 
                success:false,
                message: 'Username already exist' });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success:false,
            message: "General Error" })
    }
});


//requirement number 8
router.delete('/deleteUser/:username', async (req, res) => {
    try {
        const username= req.params.username;
        const user = await User.findOne({Username: username});
        console.log(user)
        if (user) {
            await User.deleteOne(user);
            const users = await User.find({});
            res.status(200).json({
            success:true,
            deletedUser: user,
            usersLeft: users,});
        }
        else {
            res.status(500).json({ 
                success:false,
                message: "User doesn't exist" });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success:false,
            message: "General Error" })
    }
});

//requirement number 9
router.get('/viewDoctorApplications', async (req, res) => {
    try {
        const doctorApplications = await DoctorApplication.find({});
        if (doctorApplications) {
            res.status(200).json({
                success:true,
                doctorApplications: doctorApplications});
        }
        else {
            res.status(500).json({ 
                success:false,
                message: "No doctor applications found" });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success:false,
            message: "General Error" })
    }
});


//requirement number 10
router.post('/addHealthPackage', async (req, res) => {
    const newPackage = req.body.healthPackage;
    const packageType = newPackage.packageType;
    try {
            const existingPackage = await HealthPackage.findOne({packageType:packageType});
            if(existingPackage){
                res.status(500).json({ 
                    success:false,
                    message: "This package already exists" });
            }else{
                const heathPackage = new HealthPackage({
                    packageType : packageType,
                    subsriptionFeesInEGP : newPackage.subsriptionFeesInEGP,
                    doctorDiscountInPercentage : newPackage.doctorDiscountInPercentage,
                    medicinDiscountInPercentage : newPackage.medicinDiscountInPercentage,
                    familyDiscountInPercentage : newPackage.familyDiscountInPercentage
                });
                heathPackage.save();
                res.status(200).json({
                    success:true,
                    healthPackage: heathPackage});
            }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success:false,
            message: "General Error" })
    }
});


//requirement number 10
router.put('/updateHealthPackage', async (req, res) => {
    const packageType = req.body.healthPackage.packageType;
    try {
            const existingPackage = await HealthPackage.findOne({packageType:packageType});
            let newPackage = req.body.healthPackage
            if(existingPackage){
                await HealthPackage.findByIdAndUpdate(existingPackage._id,newPackage);
                res.status(200).json({
                    success:true,
                    updatedHealthPackage: newPackage});
            }else{
                res.status(500).json({ 
                    success:false,
                    message: "This package doesn't exist" });
            }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success:false,
            message: "General Error" })
    }
});


//requirement number 10
router.delete('/deleteHealthPackage', async (req, res) => {
    const packageType = req.body.packageType;
    try {
            const existingPackage = await HealthPackage.findOne({packageType:packageType});
            if(existingPackage){
                await HealthPackage.deleteOne({packageType:packageType});
                res.status(200).json(
                    {success:true,
                    deletedHealthPackage: existingPackage});
            }else{
                res.status(500).json({
                     success:false,
                     message: "This package doesn't exist" });
            }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success:false,
            message: "General Error" })
    }
});

//requirement number 10
router.get('/viewHealthPackages', async (req, res) => {
    try {
            const packages = await HealthPackage.find({});
            if(packages){
                res.status(200).json(
                    {success:true,
                        packages: packages});
            }else{
                res.status(500).json({
                     success:false,
                     message: "No Packages Available" });
            }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success:false,
            message: "General Error" })
    }
});

router.get('/fetchUsers', async (req, res) => {
    try {
      const users = await User.find(({'__t': {$ne : "RequestedDoctor"}}));
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