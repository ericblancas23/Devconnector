const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput() {
    let errors = {};

    if(!Validator.isLength(data.text, { min: 10, max: 300})) {
        errors.text = 'Post must be between 30 to 300 characters'
    } 

    if (Validator.isEmpty()) {
        errors.text = 'Post is empty'
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
