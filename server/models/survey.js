let mongoose = require('mongoose');

//Create a model class
let questionSchema = mongoose.Schema({
    question:String,
    options:Array
})

let surveyModel = mongoose.Schema({
    name: String,
    created: Date,
    expiry: Date,
    type: String,
    surveyQuestion: [questionSchema]
},
{
    collection:"surveys"
});

module.exports = mongoose.model('Survey', surveyModel);