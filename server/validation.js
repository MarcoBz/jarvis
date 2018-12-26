const Joi = require('joi')
class Validation{
    

    validateAction(tvSeries) {
        const schema = {
            action : Joi.string().min(1).required(),
            checkedToday : Joi.boolean().required()
        }; 
        return Joi.validate(tvSeries, schema);
      }
}
module.exports = Validation