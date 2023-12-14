import React from "react";
import PackageTab from "../components/subscribeToPackage";
import {PatientNavBar} from '../components/PatientNavBar.jsx';
function SubPackage() {
  return( <div>
    <PatientNavBar/>
   <PackageTab/>
   </div>
  );
}

export default SubPackage;