import express from 'express'
import PharmacistModel from '../Models/Pharmacist.js';
import user from '../Models/userModel.js';
import MedicineModel from '../Models/Medicine.js';
import multer from 'multer';
import protect from '../middleware/authMiddleware.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const router = express.Router();
//search for medicine based on name
router.get('/getMedicine', protect, async (req, res) => {
  let exists = await user.findById(req.user);
  if (!exists || exists.__t !== 'Pharmacist') {
    return res.status(500).json({
      success: false,
      message: "Not authorized"
    });
  }
  const Name = req.query.Name.toLowerCase();
  if (!Name) {
    return res.status(400).send({ message: 'Please fill the input', success: false });
  }
  try {
    // const Name = req.body;
    const Medicines = await MedicineModel.findOne({ Name });
    if (!Medicines) {
      return (res.status(400).send({ message: "No Medicine with this name", success: false }));
    }
    res.status(200).json({ Redult: Medicines, success: true });
  }

  catch (error) {
    res.status(500).json({ message: "Failed getMedicine", success: false })
  }
});

//add another pharmacist with a set username and password

router.post('/createPharmacist', upload.fields([{ name: "ID" }, { name: "Degree" }, { name: "License" }]), async (req, res) => {
  try {
    // Wait for the upload.single('ID') middleware to finish
    // await upload.single('ID')(req, res, async () => {
    //   if (!req.file) {
    //     return res.status(400).send('No file uploaded.');
    //   }

    // Process the form data and save the pharmacist to the database
    const Username = req.body.Username;
    const Name = req.body.Name;
    const Email = req.body.Email;
    const Password = req.body.Password;
    const DateOfBirth = req.body.DateOfBirth;
    const HourlyRate = req.body.HourlyRate;
    const Affiliation = req.body.Affiliation;
    const EducationalBackground = req.body.EducationalBackground;
    const Position = req.body.Position;

    const userExist = await PharmacistModel.findOne({ Username });
    if (userExist) {
      res.status(400);
      throw new Error('Username already exists');
    }
    const pharmacist = new PharmacistModel({
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      HourlyRate,
      Affiliation,
      EducationalBackground,
      Position,
      ID: {
        data: req.files.ID[0].buffer,
        contentType: req.files.ID[0].mimetype,
      },
      Degree: {
        data: req.files.Degree[0].buffer,
        contentType: req.files.Degree[0].mimetype,
      },
      License: {
        data: req.files.License[0].buffer,
        contentType: req.files.License[0].mimetype,
      },
    });

    const newPharmacist = await pharmacist.save();

    res.status(201).json({ Result: newPharmacist, success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed OP', success: false });
  }
});

// ,async(req,res)=>{
//   try{
//     const Username= req.body.Username;
//     const Name = req.body.Name;
//     const Email = req.body.Email;
//     const Password = req.body.Password;
//     const DateOfBirth = req.body.DateOfBirth;
//     const HourlyRate = req.body.HourlyRate;
//     const Affiliation = req.body.Affiliation;
//     const EducationalBackground = req.body.EducationalBackground;
//     const Position = req.body.Position;
//     const userexist = await PharmacistModel.findOne({Username});
//     if(userexist){
//       res.status(400);
//       throw new Error("Username already exist");
//     }
//     if (!req.file) {
//      return res.status(400).send('No file uploaded.');
//  } 
//     const Pharmacist = new PharmacistModel({Username, Name,Email,Password,DateOfBirth,HourlyRate,Affiliation,EducationalBackground,Position,
//      Picture:{
//        data: req.file.buffer,
//        contentType: req.file.mimetype
//      }
//    });
//     const NewPharmacist = await Pharmacist.save();
//     res.status(201).json({Result : NewPharmacist, success : true }); 

//   }

//  catch (error){
//     res.status(500).json({error: 'Failed OP', success : false })
//  }
// });


//add a medicine using name w ingredients w price w quantity
//    const addMedicine = async (req, res) => {
//     try{
//        const Name = req.body.Name;
//        const Price = req.body.Price;
//        const Quantity = req.body.Quantity;
//        const ActiveIngredients = req.body.ActiveIngredients;
//        const MedicalUse = req.body.MedicalUse;
//        const medicineExists = await MedicineModel.findOne({Name});
//      if(medicineExists){
//        res.status(500);
//        throw new Error("Medicine already exists");
//      }
//        const medicine = new MedicineModel({Name,Price,Quantity,ActiveIngredients,MedicalUse});
//        const NewMedicine = await medicine.save();
//        res.status(201).json({Result : NewMedicine , success : true });

//     }
//     catch(error){
//        res.status(500).json({error:"Cannot do this", success : false })
//     }

//  }

router.post('/addMedicine', upload.single('photo'), protect, async (req, res) => {
  try {
    let exists = await user.findById(req.user);
    if (!exists || exists.__t !== 'Pharmacist') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    // Get the ActiveIngredients and MedicalUse inputs
    const Name = req.body.Name;
    const Price = req.body.Price;
    const Quantity = req.body.Quantity;
    const ActiveIngredients = req.body.ActiveIngredients;
    const MedicalUse = req.body.MedicalUse;
    const Sales = 0;
    const overTheCounter = req.body.OverTheCounter;
    console.log(req.body.OverTheCounter);


    // Split the ActiveIngredients and MedicalUse inputs into arrays
    console.log(ActiveIngredients);
    const ActiveIngredientsArray = ActiveIngredients.split(',');
    const MedicalUseArray = MedicalUse.split(',');

    // Create an empty array to store the split ActiveIngredients and MedicalUse values
    const SplitActiveIngredients = [];
    const SplitMedicalUse = [];

    // Iterate over the ActiveIngredients and MedicalUse arrays and push each value into the SplitActiveIngredients and SplitMedicalUse arrays
    for (const ActiveIngredient of ActiveIngredientsArray) {
      SplitActiveIngredients.push(ActiveIngredient.trim());
    }

    for (const MedicalUseValue of MedicalUseArray) {
      SplitMedicalUse.push(MedicalUseValue.trim());
    }
    const medicineExists = await MedicineModel.findOne({ Name });
    if (medicineExists) {
      res.status(400);
      throw new Error("Medicine already exists");
    }

    //router.post('/upload', upload.single('photo'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    // Update the medicine object with the split ActiveIngredients and MedicalUse values
    const medicine = new MedicineModel({
      Name: req.body.Name,
      Price: req.body.Price,
      Quantity: req.body.Quantity,
      Sales:Sales,
      ActiveIngredients: SplitActiveIngredients,
      MedicalUse: SplitMedicalUse,
      Picture: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      OverTheCounter: req.body.OverTheCounter,
    });

    // Save the medicine object to the database
    const NewMedicine = await medicine.save();

    // Return the new medicine object to the client
    res.status(201).json({ Result: "Medicine added ", success: true });
  } catch (error) {
    console.log(error.message);
    // Handle any errors
    res.status(400).json({ error: error.message, success: false });
  }
});



router.put('/editMedicine', protect, async (req, res) => {
  try {
    let exists = await user.findById(req.user);
    if (!exists || exists.__t !== 'Pharmacist') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const medicineName = req.query.medicineName;
    const newPrice = req.query.newPrice;
    const newIngredients = req.query.newIngredients;
    const updateFields = {};
    updateFields.ActiveIngredients = newIngredients;
    updateFields.Price = newPrice;
    const updatedMedicine = await MedicineModel.findOneAndUpdate(
      { Name: medicineName },
      updateFields,
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.status(200).json(updatedMedicine);
  }
  catch (error) {
    res.status(500).json({ error: "Cannot do this" })
  }
});


router.get('/editMedicine', protect, async (req, res) => {
  try {
    let exists = await user.findById(req.user);
    if (!exists || exists.__t !== 'Pharmacist') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const medicineName = req.query.medicineName;
    const newPrice = req.query.newPrice;
    const newIngredients = req.query.newIngredients;
    const updateFields = {};
    updateFields.ActiveIngredients = newIngredients;
    updateFields.Price = newPrice;
    const updatedMedicine = await MedicineModel.findOneAndUpdate(
      { Name: medicineName },
      updateFields,
      { new: true }
    );
    if (!updatedMedicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.status(200).json(updatedMedicine);
  }
  catch (error) {
    res.status(500).json({ error: "Cannot do this" })
  }
});



router.get('/getinfoMeds', protect, async (req, res) => {
  //retrieve all users from the database
  try {
    let exists = await user.findById(req.user);
    if (!exists || exists.__t !== 'Pharmacist') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const meds = await MedicineModel.find().select({
      Name: 1,
      Quantity: 1,
      Sales: 1,
    });;
    res.status(200).json({ Result: meds, success: true });
  }

  catch (error) {
    res.status(500).json({ message: "No Medicine listed", success: false })
  }
})

//SELL MEDICINE 
router.get('/sellMedicine', protect, async (req, res) => {
  try {
    let exists = await user.findById(req.user);
    if (!exists || exists.__t !== 'Pharmacist') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    let medicineName = req.query.medicineName.toLowerCase();
    let medcheck = await MedicineModel.findOne({ Name: medicineName });

    if (!medcheck) {
      res.status(404).json({ message: "Medicine doesn't exist", success: false });
      return;
    }

    if (medcheck.Quantity === 0) {
      res.status(500).json({ message: "Medicine out of stock", success: false });
      return;
    }
    let updateFields = {};
    updateFields.Quantity = --medcheck.Quantity;
    updateFields.Sales = ++medcheck.Sales;
    medcheck = await MedicineModel.findOneAndUpdate(
      { Name: medicineName },
      updateFields,
      { new: true }
    );
    console.log(medcheck.Name);
    console.log(medcheck.Quantity--);
    console.log(medcheck.Sales++);

    res.status(200).json({ message: "Medicine sold successfully", success: true });
  }
  catch (error) {
    res.status(500).json({ message: "Error in selling medicine", success: false });
  }
});



router.get('/get-image/:id', protect, async (req, res) => {
  try {
    let exists = await user.findById(req.user);
    if (!exists || exists.__t !== 'Pharmacist') {
      return res.status(500).json({
        success: false,
        message: "Not authorized"
      });
    }
    const medicine = await MedicineModel.findById(req.params.id);
    if (!medicine) {
      return res.status(404).send('Medicine not found');
    }
    console.log(medicine.Picture.contentType);
    res.set('Content-Type', medicine.Picture.contentType);
    res.send(medicine.Picture.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving the image.');
  }
});

// module.exports = { addMedicine };
export default router;
