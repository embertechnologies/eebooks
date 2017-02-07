var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var htmlToPdf = require('html-pdf');
var multer = require('multer');
var textract = require('textract');
var Firepad = require('firepad');
var Firebase = require('firebase/app');
var config = {
			apiKey: "AIzaSyBp2WD3GLlmViecQk5HKVG426Uk3hToKIM",
			authDomain: "eebooks.firebaseapp.com",
			databaseURL: "https://eebooks.firebaseio.com",
			storageBucket: "project-4658236495382733131.appspot.com",
			};
var firebaseApp = Firebase.initializeApp(config);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.get('/export-pdf', function(req, res) {
	var htmlText = req.query.text;
	console.log("SERVER: Received text: " + htmlText);
	
	var options = {format: 'Letter', orientation: 'portrait', border: '0.5in'};
    console.log(htmlToPdf);
	htmlToPdf.create(htmlText, options).toFile('./PDFoutput.pdf', function (err, convertResult) {
		if (err) res.send("error converting to pdf: " + err);
		else res.send("Success converting to pdf: " + convertResult);
      
        console.log("end of htmlToPdf.create");
	});	
  
    console.log('at end of export-pdf');
});

var mStorage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/');	
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
})
var uploading = multer({
	//dest: 'uploads/',
	limits: {fileSize: 10000000, files: 1}, //10MB limit
	storage: mStorage
});

router.post('/upload', uploading.single('userdoc'), function(req,res) {
	console.log(req.body); 
	console.log(req.file);
  
    if(req.file == undefined) return "Error: no file uploaded";
  
	var headless = new Firepad.Headless("https://eebooks.firebaseio.com");
	
	textract.fromFileWithPath(req.file.path, {'preserveLineBreaks': true},function(err, text) {
		if(err)
			return console.log(err);
		
		console.log('uploaded text: ' + text);
		
		
		headless.setText(text, function(err, committed) {
			if(err != null) 
				console.error(err)
			else {
				if(!committed)
					console.error("Text was not committed");
			}			
		});
		
		headless.dispose();
		
	});
  
    //Read plaintext files (without using textract)
	/*fs.readFile(req.file.path, 'utf8', function(err, data) {
		if(err)
			return console.log(err);
		console.log('in uploaded text: ' + data);
		
		headless.setText(data, function(err, committed) {
			if(err != null) 
				console.error(err)
			else {
				if(!committed)
					console.error("Text was not committed");
			}			
		});
		
		headless.dispose();
	});*/
	
	//var fireRef = new firebaseApp('https://eebooks.firebaseio.com').push();
	
	
	res.status(204).end();
});

module.exports = router;
