const express = require('express');
const schoolService = require('../services/schoolService');

const router = express.Router();

router.post('/addSchool', async (req, res) => {
  try {
    const errors = schoolService.validateSchoolData(req.body);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    const school = await schoolService.addSchool(req.body);
    
    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: school
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
});

router.get('/listSchools', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required query parameters'
      });
    }
    
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    
    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values'
      });
    }
    
    if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
      return res.status(400).json({
        success: false,
        message: 'Latitude must be between -90 and 90, longitude between -180 and 180'
      });
    }
    
    const schools = await schoolService.getSchoolsSortedByProximity(userLat, userLon);
    
    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: schools
    });
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve schools',
      error: error.message
    });
  }
});

module.exports = router;
