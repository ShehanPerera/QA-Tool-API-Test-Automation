## QA-Tool API Test Automation

* This is a API test automation tool based on postman,newman and nodejs.
* Using postman and newman we can verify responses and details related to response such as response code , response time.
* But we are not able to capture logs from API module.
* Using this tool we can capture logs if need.
* Easy to add more test cases 
* Easy to add test requests (only postman collection and testcase csv addition will give newer test scope)
* Can run in CLI  

## Pre-requires 

node -v : v10.23.0

npm -v : 6.14.8

run npm insall in QA-Tools-API-Automation folder

##### if need
npm install -S newman

npm install -S newman-reporter-htmlextra

npm install read-last-lines --save

npm install -S properties-reader

### Run mock server

1. Go to ``QA-Tools-API-Automation/mock-server``
2. Run ``node runServer.js``
3. When send requests for mock-server , mock.logs will update for each requests

##To verify responses only (for Production, DA-SmokeTest)


1. Go to ``QA-Tools-API-Automation`` folder 
2. Remove files in ``reports`` folder
3. Set mock-server url properly in ``QATool-Conf.json`` in ``values.value : "http://172.16.3.184:3000"`` if need.
4. Update ``QATool-GET-Testcases.csv`` as need (can add more test cases or update values for test cases Eg : new 
username,password and expected results for it).
5. Run following command

<pre>
newman run GET-Example/QATool-GET.postman_collection.json -g QATool-Conf.json -d GET-Example/QATool-GET-Testcases
.csv -r htmlextra --reporter-htmlextra-export reports/QATool-report.html --reporter-htmlextra-title "QA-Tool Report"
</pre>
6. Go to ``reports`` folder and open ``QATool-report.html`` in browser and verify all test cases are passed.


##Sanity Flow Testing 

1. Copy ``QA-Tools-API-Automation`` folder  in to server 
2. Ensure all Pre-requires are installed 
3. Go to ``QA-Tools-API-Automation`` folder 
4. Remove files in ``reports`` and ``tempcsv`` folders  and remove ``index.html`` file.
5. Set mock-server url properly in ``QATool-Conf.json`` in ``values.value : "http://127.0.0.1:3000"`` if need.
6. Update ``QATool-GET-Testcases.csv`` as need (can add more test cases or update values for test cases Eg : new 
username, password and expected results for it).
7. If need to get logs please  add log column in ``QATool-GET-Testcases.csv``  and add values as follows

* pattern 

``<module-name>,<log-path>,<number of loglines need to capture>``

<pre>
Eg : if only one moduel log need to capture add as 
"mock,/home/shehan/QA-Tools-API-Automation/mock-server/mock.logs,1"

Eg : if multiple moduel log need to capture add as 
"mock,/home/shehan/QA-Tools-API-Automation/mock-server/mock.logs,1;mock2,/home/shehan/QA-Tools-API-Automation/mock-server/mock.logs,1"

Eg : if no need logs for some cases add as "no"
</pre>

also add log column number in ``cloumnNumber=6`` in ``config.properties`` 

8.Update following in  ``config.properties`` as needed
<pre>
data_dir=/home/shehan/QA-Tools-API-Automation
dataCSV=GET-Example/QATool-GET.csv
JSONcollection=GET-Example/QATool-GET.postman_collection.json
globalEnv=QATool-Conf.json
cloumnNumber=6
</pre> 
9.Then run ``node runTests.js`` in ``QA-Tools-API-Automation`` folder

10.After finish test execution run ``node combineReports.js``

11.Open ``index.html`` in browser  (if copying this back to local machine copy full directory ``mSpace-LBS-API-Automation-Postman``)


## Updating Request or Test scenario

1. Import ``QATool-GET.postman_collection.json`` in to postman 
2. Using Body tab request can change 
3. Using Tests tab Test scenario can change 

<pre>
Eg : 
    pm.test(testcase + " validate response name",function() {
        pm.expect(pmresp[0].name).to.eql(pm.iterationData.get("expect_name"));
    });
</pre>
 

##Adding test case to csv 

* CSV pattern 

```
testcase,username,password,expect_name,expect_usertype,logs
```

First Copy existing line as bellow (no need heading line just for understanding )

```
testcase,username,password,expect_name,expect_usertype,logs
Verify_admin_data,admin,123,ADMIN,admin,"mock,/home/shehan/QA-Tools-API-Automation/mock-server/mock.logs,1"
```

Then Past to new line and update test case as need (no need heading line just for understanding )

```
testcase,username,password,expect_name,expect_usertype,logs
new_testcase,admin,123,ADMIN,admin,"mock,/home/shehan/QA-Tools-API-Automation/mock-server/mock.logs,1"
```
