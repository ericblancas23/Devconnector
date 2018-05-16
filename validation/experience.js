const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = "title must not be empty";
    }
    if (Validator.isEmpty(data.company)) {
        errors.company = "Please provide Company";
    }
    if (Validator.isEmpty(data.from)) {
        errors.from = "Please provide date";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}