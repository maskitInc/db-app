var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/test');

var Schema = mongoose.Schema;

var userDataSchema = new Schema(
    {
        areaNum: String,
        clientfirstname: String,
        clientMiddleName: String,
        clientLastName: String,
        phoneNum: String,
        counterModel: String,
        cost: String,
        periodRatesFrom: String,
        kvFrom: String,
        sumFrom: String,
        paidFrom: String,
        paymentDateFrom: String,
        debtFrom: String,
        periodRatesTo: String,
        kvTo: String,
        sumTo: String,
        paidTo: String,
        paymentDateTo: String,
        debtTo: String
    }, {
        collection: 'user-data'
    }
);

var UserData = mongoose.model('UserData', userDataSchema);

/* GET home page. */
router.get('/', function (req, res, next) {
    
    UserData.find()
        .then(function (doc) {
            res.render('index', {title: 'Головна', items: doc});
        });
    
    //res.render('index');
    
});

router.get('/get-data', function (req, res, next) {
    UserData.find()
        .then(function (doc) {
            res.render('index', {items: doc});
        });
});

router.post('/insert', function (req, res, next) {
    var item = {
        areaNum: req.body.areaNum,
        clientFirstName: req.body.clientFirstName,
        clientMiddleName: req.body.clientMiddleName,
        clientLastName: req.body.clientLastName,
        phoneNum: req.body.phoneNum,
        counterModel: req.body.counterModel,
        cost: req.body.cost,
        periodRatesFrom: req.body.periodRatesFrom,
        kvFrom: req.body.kvFrom,
        paidFrom: req.body.paidFrom,
        paymentDateFrom: req.body.paymentDateFrom,
        debtFrom: req.body.debtFrom,
        periodRatesTo: req.body.periodRatesTo,
        kvTo: req.body.kvTo,
        sumTo: req.body.sumTo,
        paidTo: req.body.paidTo,
        paymentDateTo: req.body.paymentDateTo,
        debtTo: req.body.debtTo
    };
    
    var data = new UserData(item);
    
    data.save();
    
    res.redirect('/');
});

router.post('/update', function (req, res, next) {
    var id = req.body.id;
    
    UserData.findById(id, function (err, doc) {
        if (err) {
            console.error('error, no entry found');
        }
        doc.title = req.body.title;
        doc.content = req.body.content;
        doc.author = req.body.author;
        doc.save();
    })
    res.redirect('/');
});

router.post('/delete', function (req, res, next) {
    var id = req.body.id;
    UserData.findByIdAndRemove(id).exec();
    res.redirect('/');
});

module.exports = router;
