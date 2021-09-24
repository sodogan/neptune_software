
/*
* This script will generate all the weeks starting from Monday till Sunday of a given year 
*/
const generateWeeks = (startDateStr, endDateStr) => {
  var weeks = [];
  //var startDate = modules.moment(new Date(2021, 0, 1)).isoWeekday(8);
  var startDate = modules.moment(startDateStr).isoWeekday(8);

  if (startDate.date() == 8) {
    startDate = startDate.isoWeekday(-6)
  }
  //var endDate = modules.moment().isoWeekday('Sunday');
  var endDate = modules.moment(endDateStr).isoWeekday('Sunday');

  while (startDate.isBefore(endDate)) {
    let startDateWeek = startDate.isoWeekday('Monday').format('YYYY-MM-DD');
    let endDateWeek = startDate.isoWeekday('Sunday').format('YYYY-MM-DD');
    startDate.add(7, 'days');
    weeks.push([startDateWeek, endDateWeek]);
  }

  return weeks;
}

/*
* This transforms the list of weeks into a format to be inserted into schedule_header table!
*  {
    beginWeek: '20-12-2021',
    endWeek: '26-12-2021',
    calenderWeek: 26,
    createdAt: 1618827997759,
    updatedAt: 1618827997759,
    createdBy: 'solen',
    updatedBy: 'solen'
  }
*/
const transform = (weeksArray) => {
  const username = 'solen';
  const result = weeksArray.map((item) => {
    return {
      beginWeek: item[0],
      endWeek: item[1]
    }
  });

  for (let index = 0; index < result.length; index++) {
    console.log(result[index]);
    let obj = result[index];
    counter = index + 1;
    obj.calenderWeek = counter;
    obj.createdAt = Date.now();
    obj.updatedAt = Date.now();
    obj.createdBy = username;
    obj.updatedBy = username;

  }
  return result;
}


try {

  // First step generate the weeks!
  const allTheWeeks = generateWeeks('2021-01-01', '2022-01-01');
  console.log(allTheWeeks);

  if (!allTheWeeks.length) {
    result.data = {
      Error: {
        message: "GenerateWeeks has failed",
        status: 400
      }
    };
    result.statusCode = 400;
    return complete();

  }

  //transform the data into a format where can be inserted into the database!
  const transformedArray = transform(allTheWeeks);


  if (!transformedArray.length) {
    result.data = {
      Error: {
        message: "Transform has failed",
        status: 400
      }
    };
    result.statusCode = 400;
    return complete();


  }
 
  // First clear up all the existing records
  const deletedRecords= await entities.schedule_header.delete({});
  
  //Insert the new records into the Database!  
  const entity = await entities.schedule_header.insert(transformedArray);


  result.data = {
    dates: transformedArray
  }


} catch (err) {
  log.error(err.message);
  fail();
}

complete();