const db = require('../database/connection');

function validateSchoolData(data) {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!data.address || typeof data.address !== 'string' || data.address.trim() === '') {
    errors.push('Address is required and must be a non-empty string');
  }
  
  if (data.latitude === undefined || data.latitude === null) {
    errors.push('Latitude is required');
  } else if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
    errors.push('Latitude must be a number between -90 and 90');
  }
  
  if (data.longitude === undefined || data.longitude === null) {
    errors.push('Longitude is required');
  } else if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
    errors.push('Longitude must be a number between -180 and 180');
  }
  
  return errors;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function addSchool(schoolData) {
  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  const values = [
    schoolData.name.trim(),
    schoolData.address.trim(),
    schoolData.latitude,
    schoolData.longitude
  ];
  
  const [result] = await db.execute(query, values);
  return { id: result.insertId, ...schoolData };
}

async function getAllSchools() {
  const [schools] = await db.execute('SELECT * FROM schools');
  return schools;
}

async function getSchoolsSortedByProximity(userLat, userLon) {
  const schools = await getAllSchools();
  
  const schoolsWithDistance = schools.map(school => ({
    ...school,
    distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
  }));
  
  schoolsWithDistance.sort((a, b) => a.distance - b.distance);
  
  return schoolsWithDistance;
}

module.exports = {
  validateSchoolData,
  addSchool,
  getAllSchools,
  getSchoolsSortedByProximity
};
