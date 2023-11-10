import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthPackageSubscription = () => {
  const [userHealthPackage, setUserHealthPackage] = useState(null);
  const [familyMembersHealthPackages, setFamilyMembersHealthPackages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's health package
        const userResponse = await axios.get('http://localhost:8000/patient/viewSubscriptions');
        setUserHealthPackage(userResponse.data.userHealthPackage);

        // Fetch health packages for registered family members
        const familyResponse = await axios.get('http://localhost:8000/patient/viewSubscriptions');
        setFamilyMembersHealthPackages(familyResponse.data.familyMembersHealthPackages);
      } catch (error) {
        console.error('Error fetching health package subscriptions:', error.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div className="surface-ground px-4 py-8 md:px-6 lg:px-8">
      <div className="text-900 font-bold text-6xl mb-4 text-center">Health Package Subscriptions</div>

      <div className="grid">
        {/* Render user's health package */}
        {userHealthPackage && (
          <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
              <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                <div className="text-900 font-medium text-xl mb-2">{userHealthPackage.name}</div>
                {/* Add other health package details */}
                <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                <div className="flex align-items-center">
                  <span className="font-bold text-2xl text-900">{userHealthPackage.price}</span>
                  <span className="ml-2 font-medium text-600">per month</span>
                </div>
                <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                {/* Add other health package features */}
                <hr className="mb-3 mx-0 border-top-1 border-none surface-border mt-auto" />
                <button className="p-3 w-full mt-auto">Buy Now</button>
              </div>
            </div>
          </div>
        )}

        {/* Render health packages for registered family members */}
        {familyMembersHealthPackages.length > 0 &&
          familyMembersHealthPackages.map((packages, index) => (
            <div className="col-12 lg:col-4" key={index}>
              <div className="p-3 h-full">
                <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                  <div className="text-900 font-medium text-xl mb-2">{packages.name}</div>
                  {/* Add other health package details */}
                  <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                  <div className="flex align-items-center">
                    <span className="font-bold text-2xl text-900">{packages.price}</span>
                    <span className="ml-2 font-medium text-600">per month</span>
                  </div>
                  <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                  {/* Add other health package features */}
                  <hr className="mb-3 mx-0 border-top-1 border-none surface-border" />
                  <button className="p-3 w-full">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HealthPackageSubscription;
