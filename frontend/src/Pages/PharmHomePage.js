import "../Styles/PharmHomePage.css";
// // // import Meds from "../Components/Meds";

// // // const Homescreen = () =>{
// // //     return(
// // //         <div className="homescreen">
// // //             <h2 className="homescreen_title">Meds</h2>
// // //             <div className="homescreen_meds">
// // //                 <Meds />
// // //                 <Meds />
// // //                 <Meds />
// // //                 <Meds />
// // //                 <Meds />
// // //                 <Meds />

// // //             </div>

// // //         </div>
// // //     )
// // // } 

// // // export default Homescreen;
// // import React, { useState, useEffect } from 'react';
// // import Meds from "../Components/Meds";
// // import Meds2 from "../Screens/Meds";

// // const Homescreen = () => {
// //     const [medicines, setMedicines] = useState([]);
// //     const params = new URLSearchParams(window.location.search);
// //     const userId = params.get('medicineId');
// //     console.log(userId);
// //     useEffect(() => {
// //         const getMedicines = async () => {
// //             try {
// //                 var response = await fetch(`http://localhost:8000/Patient/getAllMedicine/`);
// //                 const jsonData = await response.json();
// //                 let result = jsonData.Result;
// //                 setMedicines(result);
// //             } catch (error) {
// //                 console.error('Error fetching data:', error);
// //             }
// //         };

// //         getMedicines();
// //     }, []);

// //     return (
// //         <div className="homescreen">
// //             <h2 className="homescreen_title">Meds</h2>
// //             <div className="homescreen_meds">
// //                 {medicines.map((medicine) => (
// //                     <Meds key={medicine.Name} medicines={[medicine]} />
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // }




// // // import React, { useState, useEffect } from 'react';
// // // import Meds from "../Components/Meds";

// // // const Homescreen = () => {
// // //     const [medicines, setMedicines] = useState([]);

// // //     useEffect(() => {
// // //         const getMedicines = async () => {
// // //             try {
// // //                 var response = await fetch(`http://localhost:8000/Admin/getAllMedicine/`);
// // //                 const jsonData = await response.json();
// // //                 let result = jsonData.Result;
// // //                 setMedicines(result);
// // //             } catch (error) {
// // //                 console.error('Error fetching data:', error);
// // //             }
// // //         };

// // //         getMedicines();
// // //     }, []);

// // //     return (
// // //         <div className="homescreen">
// // //             <h2 className="homescreen_title">Meds</h2>
// // //             <div className="homescreen_meds">
// // //                 <Meds medicines={medicines} />
// // //             </div>
// // //         </div>
// // //     )
// // // }

// // export default Homescreen;
// import React, { useState, useEffect } from 'react';
// import Meds from '../Components/Meds';
// import SearchFilterComponent from '../Components/SearchFilter';

// const Homescreen = () => {
//   const [medicines, setMedicines] = useState([]);

//   useEffect(() => {
//     const getMedicines = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/Patient/getAllMedicine/');
//         const jsonData = await response.json();
//         const result = jsonData.Result;
//         setMedicines(result);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     getMedicines();
//   }, []);

//   return (
//     <div className="homescreen">
//       <h2 className="homescreen_title">Meds</h2>
//       <SearchFilterComponent />
//       <div className="homescreen_meds">
//         {medicines.map((medicine) => (
//           <Meds key={medicine.Name} medicines={[medicine]} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Homescreen;
// Homescreen.js
import React, { useState, useEffect } from 'react';
import Meds from '../components/Meds';
import SearchFilterComponent from '../components/SearchFilter';

const PharmHomescreen = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const getMedicines = async () => {
      try {

        
        const response = await fetch('http://localhost:8000/Patient/getAllMedicine2/',{headers:{Authorization:'Bearer '+sessionStorage.getItem("token")}});
        const jsonData = await response.json();

        // Check if jsonData.Result is an array
        if (Array.isArray(jsonData.meds)) {
          setMedicines(jsonData.meds);
        } else {
          console.error('Invalid data format. Expected an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getMedicines();
  }, []);

  return (
    <div className="homescreen">
      <h2 className="homescreen_title">Meds</h2>
      <SearchFilterComponent />
      <div className="homescreen_meds">
        {Array.isArray(medicines) ? (
          medicines.map((medicine) => <Meds key={medicine.Name} medicines={[medicine]} />)
        ) : (
          <p>Error: Medicines data is not in the expected format.</p>
        )}
      </div>
    </div>
  );
};

export default PharmHomescreen;
