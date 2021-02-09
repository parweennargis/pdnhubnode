const express = require('express');
const routes = express.Router();
const indexController = require('../controller/index');
const surveyController = require('../controller/survey');

routes.get('/', indexController.index);
routes.get('/survey', surveyController.survey);
routes.post('/result', surveyController.calculation);
routes.get('/result', surveyController.redirectUserToSurvey);

module.exports = routes;
