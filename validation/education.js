const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.school = !isEmpty(data.title) ? data.school : '';
    data.degree = !isEmpty(data.company) ? data.degree : '';
    data.fieldOfStudy = !isEmpty(data.from) ? data.fieldOfStudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.title)) {
        errors.school = "school must not be empty";
    }
    if (Validator.isEmpty(data.company)) {
        errors.degree = "Please provide degree";
    }
    if (Validator.isEmpty(data.from)) {
        errors.fieldOfStudy = "Please provide fieldOfStudy";
    }    
    if (Validator.isEmpty(data.from)) {
        errors.from = "Please provide date";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}