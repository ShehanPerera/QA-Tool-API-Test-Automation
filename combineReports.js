//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory 
const directoryPath = path.join(__dirname,'reports');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
	fs.appendFile('index.html', '<div><A href = "reports/'+file+'">'+file+'</div> '+ '\n', function (err) {
        	if (err) throw err;
        	//console.log(Date() + "successfully read line"+j);
	});
        //console.log(file); 
    });
});
