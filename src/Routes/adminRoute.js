import express from 'express'
import User from '../Models/userModel.js';
import Admin from '../Models/adminModel.js';
import DoctorApplication from '../Models/requestedDoctorModel.js';
import HealthPackage from '../Models/healthPackageModel.js';
import doctorModel from '../Models/doctorModel.js';
import MedicineModel from '../Models/Medicine.js';
import phModel from '../Models/Pharmacist.js';
import ReqPharmModel from '../Models/requestedPharmacist.js';
import protect from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = express.Router()

//requirement number 7
router.post('/createAdmin', protect, async (req, res) => {
  // Create the admin
  try {
    const exist = await Admin.findById(req.user);
    if (!exist) {
      return res.status(500).json({
        success: false,
        message: "You are not an admin"
      });
    }
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
// same as fetchReqDoctors
//requirement number 9
// router.get('/viewDoctorApplications', protect, async (req, res) => {
//     try {
//         const exist = await Admin.findById(req.user);
//         if (!exist) {
//             return res.status(500).json({
//                 success: false,
//                 message: "You are not an admin"
//             });
//         }
//         const doctorApplications = await DoctorApplication.find({});
//         if (doctorApplications) {
//             res.status(200).json({
//                 success: true,
//                 doctorApplications: doctorApplications
//             });
//         }
//         else {
//             res.status(500).json({
//                 success: false,
//                 message: "No doctor applications found"
//             });
//         }
//     }
//     catch (error) {
//         console.error('Error: ', error);
//         res.status(500).json({
//             success: false,
//             message: "General Error"
//         })
//     }
// });


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
//fetch patients,admins,doctors,pharmacists
router.get('/fetchUsers', protect, async (req, res) => {
  try {
    const exist = await Admin.findById(req.user);
    console.log(exist);
    console.log(req.user);
    if (!exist && req.user._t != "Admin") {
      return res.status(500).json({
        success: false,
        message: "You are not an admin"
      });
    }
    const users = await User.find({ $and: [{ '__t': { $ne: "RequestedDoctor" } }, { '__t': { $ne: "ReqPharmacist" } }] });
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
//view Pharmacist Info using username (you can change to ID if you want)
router.get('/getPharmacist', protect, async (req, res) => {
  const username = req.body.username;
  let user = await Admin.findById(req.user);
  if (!user || user.__t !== 'Admin') {
    return res.status(500).json({
      success: false,
      message: "Not authorized"
    });
  }
  if (!username) {
    return res.status(400).send({ message: 'user not filled ', success: false });
  }
  try {
    const Pharma = await phModel.find({ Username: username });
    if (!Pharma || Pharma.length === 0) {
      return (res.status(400).send({ message: "Pharmacist Not Found", success: false }));
    }
    res.status(200).json({ Pharma, success: true });
  }

  catch (error) {
    res.status(500).json({ message: "Failed getPharmacist", success: false })
  }
});

//view a patients's information using Username
//no need for admin to view medical history documents of patients in frontend
router.get('/getPatient', protect, async (req, res) => {
  let user = await Admin.findById(req.user);
  if (!user || user.__t !== 'Admin') {
    return res.status(500).json({
      success: false,
      message: "Not authorized"
    });
  }
  const username = req.body.username;
  if (!username) {
    return res.status(400).send({ message: 'user not filled', success: false });
  }

  try {
    const Patient = await patientModel.find({ Username: username });
    if (!Patient || Patient.length === 0) {
      return res.status(400).send({ message: 'Patient not found', success: false });
    }

    res.status(200).json({ Result: Patient, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed getPatient', success: false });
  }
});

//view a doctor's information using Username
router.get('/getDoctor', protect, async (req, res) => {
  let user = await Admin.findById(req.user);
  if (!user || user.__t !== 'Admin') {
    return res.status(500).json({
      success: false,
      message: "Not authorized"
    });
  }
  const username = req.body.username;
  if (!username) {
    return res.status(400).send({ message: 'user not filled', success: false });
  }

  try {
    const Doc = await doctorModel.find({ Username: username });
    if (!Doc || Doc.length === 0) {
      return res.status(400).send({ message: 'Doctor not found', success: false });
    }

    res.status(200).json({ Result: Doctor, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed get Doctor', success: false });
  }
});




//view doctors and pharmacists applications and accept/reject them
//view doctors applications
router.get('/fetchReqDoctors', protect, async (req, res) => {
  try {
    const exist = await Admin.findById(req.user);
    console.log(exist);
    console.log(req.user);
    if (!exist && req.user._t != "Admin") {
      return res.status(500).json({
        success: false,
        message: "You are not an admin"
      });
    }
    const users = await User.find(({ '__t': { $eq: "RequestedDoctor" } }));
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
//view Pharmacist Applications
router.get('/viewReqPharm', protect, async (req, res) => {
  try {

    const exist = await Admin.findById(req.user);
    if (!exist) {
      return res.status(500).json({
        success: false,
        message: "You are not an admin"
      });
    }

    const pharms = await ReqPharmModel.find();
    res.status(200).json({ Result: pharms, success: true });
  }
  catch (error) {
    res.status(500).json({ message: "Failed view req pharms" })
  }
});
router.post('/DoctorAcceptance/:username', protect, async (req, res) => {
  try {
    const exist = await Admin.findById(req.user);
    if (!exist && req.user._t != "Admin") {
      return res.status(500).json({
        success: false,
        message: "You are not an admin"
      });
    }
    const { username } = req.params;
    console.log(username, req.params.username);
    const user = await DoctorApplication.findOne({ Username: username });
    if (user) {
      await DoctorApplication.deleteOne(user);
      const doctor = new doctorModel({
        Username: user.Username,
        Password: user.Password,
        Name: user.Name,
        Email: user.Email,
        DateOfBirth: user.DateOfBirth,
        HourlyRate: user.HourlyRate,
        Affiliation: user.Affiliation,
        Education: user.Education,
        Speciality: user.Speciality,
        employmentContract: "Pending",
        ID: user.ID,
        Degree: user.Degree,
        License: user.License
      })
      await doctor.save();
      let result = await DoctorApplication.find();
      res.status(200).json({
        success: true,
        message: "Doctor accepted successfully",
        Result: result
      });
    }
    else {
      res.status(500).json({
        success: false,
        message: "There is no doctor to accept"
      });
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})
router.post('/PharmAcceptance/:username', protect, async (req, res) => {
  try {
    let exists = await Admin.findById(req.user);
    if (!exists || exists.__t !== 'Admin') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const { username } = req.params
    console.log(username, req.params.username);
    const user = await ReqPharmModel.findOne({ Username: username });
    console.log(user);
    if (user) {
      await ReqPharmModel.deleteOne(user);

      const pharmacist = new phModel({
        Username: user.Username,
        Password: user.Password,
        Name: user.Name,
        Email: user.Email,
        DateOfBirth: user.DateOfBirth,
        HourlyRate: user.HourlyRate,
        Affiliation: user.Affiliation,
        EducationalBackground: user.EducationalBackground,
        ID: user.ID,
        Degree: user.Degree,
        License: user.License
      })
      await pharmacist.save();
      let myResult = await ReqPharmModel.find();
      res.status(200).json({
        success: true,
        message: "Pharmacist accepted successfully",
        Result: myResult
      });
    }
    else {
      res.status(500).json({
        success: false,
        message: "There are no pharmacists to accept"
      });
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})
router.delete('/DoctorRejection/:username', protect, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await DoctorApplication.deleteOne({ Username: username });
    console.log(user);
    if (user) {
      let myResult = await DoctorApplication.find();
      res.status(200).json({
        success: true,
        message: "Doctor rejected successfully",
        Result: myResult
      });
    }
    else {
      res.status(500).json({
        success: false,
        message: "Doctor doesn't exist"
      });
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})
router.delete('/PharmRejection/:username', protect, async (req, res) => {
  try {
    let exists = await Admin.findById(req.user);
    if (!exists || exists.__t !== 'Admin') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const { username } = req.params;
    const user = await ReqPharmModel.findOne({ Username: username });
    if (user) {
      await ReqPharmModel.deleteOne(user);
      let myResult = await ReqPharmModel.find();
      res.status(200).json({
        success: true,
        message: "Pharmacist rejected successfully",
        Result: myResult
      });
    }
    else {
      res.status(500).json({
        success: false,
        message: "Pharmacist doesn't exist"
      });
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})
//requirement number 14 in Pharm
//search for medicine by name
router.get('/getMedicine/:Name', protect, async (req, res) => {
  try {
    let user = await Admin.findById(req.user);
    if (!user || user.__t !== 'Admin') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const Name = req.params.Name.toLowerCase();
    console.log(Name)
    if (!Name) {
      return res.status(400).send({ message: 'Please fill the input' });
    }

    // const Name = req.body;
    const Medicines = await MedicineModel.findOne({ Name });
    if (!Medicines) {
      return (res.status(400).send({ message: "No Medicine with this name" }));
    }
    res.status(200).json({ Result: Medicines, success: true });
  }

  catch (error) {
    res.status(500).json({ message: "Failed getMedicine", success: false })
  }
});



//requirement number 12 in Pharm  
//view a list of all available medicines (including picture of medicine, price, description)

router.get('/getAllMedicine', protect, async (req, res) => {
  //retrieve all users from the database
  try {
    if (req.user.__t !== 'Admin') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }

    const meds = await MedicineModel.find();
    res.status(200).json({ Result: meds, success: true });
  }

  catch (error) {
    res.status(500).json({ message: "No Medicine listed", success: false })
  }
});

router.get('/filterMedical/:MedicalUse', protect, async (req, res) => {
  let user = await Admin.findById(req.user);
  if (!user || user.__t !== 'Admin') {
    return res.status(500).json({
      success: false,
      message: "Not authorized"
    });
  }
  const MedicalUse = req.params.MedicalUse.toLowerCase();
  if (!MedicalUse) {
    return res.status(400).send({ message: 'Please fill the input', success: false });
  }

  const Medicines = await MedicineModel.find({ MedicalUse });
  if (!Medicines.length) {
    return res.status(400).send({ message: 'No medicines found with the specified medical use.', success: false });
  }

  res.status(200).send({ Result: Medicines, success: true })

});

router.get('/getAllUsers', protect, async (req, res) => {
  try {
    if (req.user.__t !== 'Admin') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const users = await User.find({ __t: { $ne: 'Admin' } });
    res.status(200).json({ Result: users.length, success: true });
  }

  catch (error) {
    res.status(500).json({ message: "No Users listed", success: false })
  }
})

router.get('/getOrderProgress', protect, async (req, res) => {
  try {
    if (req.user.__t !== 'Admin') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const medicines = await MedicineModel.find();

    let totalSales = 0;
    let totalQuantity = 0;

    medicines.forEach((medicine) => {
      totalSales += medicine.Sales;
      totalQuantity += medicine.Quantity;
    });


    res.status(200).json({ totalSales, totalQuantity, success: true });
  }

  catch (error) {
    res.status(500).json({ message: "No Orders listed", success: false })
  }
})

export default router;