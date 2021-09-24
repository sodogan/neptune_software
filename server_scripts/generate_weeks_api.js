
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
  const result = weeksArray.map((item) => {
    return {
      beginWeek: item[0],
      endWeek: item[1]
    }
  });

  let calenderWeekcounter = 1;
  for (let index = 0; index < result.length; index++) {
    console.log(result[index]);
    let currentDate = result[index];
    currentDate.calenderWeek = calenderWeekcounter;
    calenderWeekcounter += 1;
  }
  return result;
}


try {
  
//    if (!query.hasOwnProperty(parameter))  
 if (!req.query.startDate || !req.query.endDate ) 
    {
        result.data = {
            Error: {
                message: "startDate/endDate is missing",
                status: 400
            }
        };
        result.statusCode = 400;
        return complete();
    }


//The Dates format should be according to YYYY-MM-DD 
   const startDate = req.query.startDate;
   const endDate = req.query.endDate;

  // First step generate the weeks!
//  const allTheWeeks = generateWeeks('2021-01-01', '2022-01-01');
  const allTheWeeks = generateWeeks(startDate,endDate); 
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
 
  result.data = {
    dates: transformedArray
  }


} catch (err) {
  log.error(err.message);
  fail();
}

complete();