const newman = require('newman');
const readLastLines = require('read-last-lines');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('config.properties');
var fs = require("fs");
var path = require('path');

var data_dir = properties.get("data_dir");
var dataCSV = properties.get("dataCSV");
var JSONcollection = properties.get("JSONcollection");
var globalEnv = properties.get("globalEnv");
var logcolumn = properties.get("cloumnNumber");

// READ CSV INTO STRING
var data = fs.readFileSync(data_dir+'/'+dataCSV).toLocaleString();
// CSV STRING TO ARRAY
var rows = data.split("\n"); // SPLIT ROWS


// Run Testing request
async function runTest() {
    var header = rows[0];
    for (let i = 1; i < rows.length-1; i++) {
        var testcasename = rows[i].split(",")[0];
        createTestCSV(header,testcasename);
    }
    for (let i = 1; i < rows.length-1; i++) {
        await sleep(10000);
        var vlaue = rows[i];
        var testcasename = rows[i].split(",")[0];
        var logs = CSVtoArray(rows[i]);
        var logspaths = logs.slice(logcolumn-1,logcolumn).toString();
        updateTestCSV(vlaue,testcasename);
        runnewman(testcasename,logspaths);
    }
}

//NEWMAN EXECUTION FUNCTION
function runnewman(testcasename,logspaths) {
    newman.run({
        collection: require(data_dir+'/'+JSONcollection),
        reporters: ['htmlextra'],
        iterationData : data_dir+'/tempcsv/'+testcasename+'.csv',
	    globals :  data_dir+'/'+globalEnv,
        reporter: {
            htmlextra: {
                export: data_dir+'/reports/'+testcasename+'-report.html',
                template: data_dir+'/template.hbs',
                logs: true,
                browserTitle: "QA Tool report",
                title: testcasename+" Test Results"
            }
        }}, function (err) {
        if (err) {
            throw err;
        }

        if(logspaths.toString()!="no" && logspaths.toString()!=""){
            var logcount = logspaths.toString().split(";").length;
            for (let i=0;i<logcount;i++){
                var module = logspaths.toString().split(";")[i].split(",")[0];
                var logfile = logspaths.toString().split(";")[i].split(",")[1];
                var loglines = logspaths.toString().split(";")[i].split(",")[2];
                readLogs(testcasename,module,logfile,loglines);
            }

        }

    });
}
//READ LOGS AND WRITE TO HTML
function readLogs(testcasename,module,logfile,loglines) {
    var stream = fs.createWriteStream(data_dir+'/reports/'+testcasename+'_'+module+"_logs.html", {flags:'a'});
    stream.write('<html><head><style>div {width: 100%;border: 1px solid #000000;}div.b {word-wrap: break-word;}</style></head><body><div class="b"><h5>'+module+'-Logs</h5>');
    readLastLines.read(logfile, loglines)
        .then((lines) => stream.write(lines+'</div></body></html>'));
}
//Creating Temp csv for one by one test run
function createTestCSV(header,testcasename) {
    fs.appendFile(data_dir+'/tempcsv/'+testcasename+'.csv', header + '\n', function (err) {
        if (err) throw err;
    });
}
//Add test cases to created csv one by one
function updateTestCSV(value,testcasename) {
    fs.appendFile(data_dir+'/tempcsv/'+testcasename+'.csv', value + '\n', function (err) {
        if (err) throw err;
    });
}

//SLEEP FUNCTION
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
});
}

//Function from Internet to get csv data correclty
function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

runTest();


