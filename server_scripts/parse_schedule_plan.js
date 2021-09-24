//Helper functions
/*
* This script will parse the schedule plan and find the current based on todays Date
* The ref tables are schedule_header where all dates are kept! 
* THis script uses Moment NPM Module for parsing dates
*/
//Example code: const all_roles = await genericFetchFromTable(entities.roles,{ select:["id","name"],where:{ name :"Tod" }  });

const findCurrentDate = (all_schedule_headers, anyDate) => {
    let current_date_header = all_schedule_headers.filter((item) => {
        const startDate = modules.moment(new Date(item.beginWeek)).format('YYYY-MM-DD');
        const endDate = modules.moment(new Date(item.endWeek)).format('YYYY-MM-DD');
        const isValid = modules.moment(anyDate).isSameOrAfter(startDate, 'day') &&
            modules.moment(anyDate).isSameOrBefore(endDate, 'day');
        if (isValid) {
            return item;
        }
    });
    return current_date_header[0].id;
}

//Main function that builds the output.!
const buildOutputResult = async (
    matching_schedule_items,
    users,
    modules,
    templates,
    roles
) => {
    "use strict";
    const result = [];
    for (let data of matching_schedule_items) {
        try {

            //lookup the user matching with todID
            let user = await globals.global_functions.lookUpWithID(users, data.userID);
            data.firstName = user.firstName;
            data.lastName = user.lastName;
            data.emailAddress = user.emailAddress;
            data.mobileNumber = user.mobileNumber;
            data.backupMobileNumber = user.backupMobileNumber;
            data.isExternal = user.isExternal;
            data.roleID = user.roleID;
            data.managerID = user.managerID;
            let { name: roleName } = await globals.global_functions.lookUpWithID(roles, data.roleID);
            data.roleName = roleName;

            let template = await globals.global_functions.lookUpWithID(templates, data.templateID);
            data.templateName = template.name;
            data.templateManagerID = template.templateManagerID;
            //get the templateManager Name from the users
            let templateManager = await globals.global_functions.lookUpWithID(users, data.templateManagerID);
            //data.templateManager = {...templateManager};//if nested needed
            data.templateManagerFirstName = templateManager.firstName;
            data.templateManagerLastName = templateManager.lastName;
            data.templateManagerEmailAddress = templateManager.emailAddress;
            data.templateManagerMobileNumber = templateManager.mobileNumber;
            data.templateManagerBackupMobileNumber = templateManager.backupMobileNumber;

            //As module is optional for Mims!-can be empty
            if (data.moduleID) {
                let module = await globals.global_functions.lookUpWithID(modules, data.moduleID);
                data.moduleName = module.name;
            }
            else {
                data.moduleID = '';
                data.moduleName = '';
            }
        } catch (err) {
            log.info(`Exception at buildOutputResult with errr: ${err}`);
        }
        result.push(data);
    }
    return result;

};


//Main function that builds the output.!
const buildOutputResultForMods = async (
    matching_schedule_header_mods,
    users,
    roles
) => {
    "use strict";
    const primary = 'primary';
    const backup = 'backup';

    const result = [];
    for (let data of matching_schedule_header_mods) {
        try {
            //lookup the primary Md
            let primaryMod = await globals.global_functions.lookUpWithID(users, data.modID);
            data[`${primary}_firstName`] = primaryMod.firstName;
            data[`${primary}_lastName`] = primaryMod.lastName;
            data[`${primary}_emailAddress`] = primaryMod.emailAddress;
            data[`${primary}_mobileNumber`] = primaryMod.mobileNumber;
            data[`${primary}_backupMobileNumber`] = primaryMod.backupMobileNumber;
            data.isExternal = primaryMod.isExternal;
            data.roleID = primaryMod.roleID;
            data.managerID = primaryMod.managerID;
            let { name: roleName } = await globals.global_functions.lookUpWithID(roles, data.roleID);
            data.roleName = roleName;

            //lookup the backup Md
            let backupMod = await globals.global_functions.lookUpWithID(users, data.modID);
            data[`${backup}_firstName`] = backupMod.firstName;
            data[`${backup}_lastName`] = backupMod.lastName;
            data[`${backup}_emailAddress`] = backupMod.emailAddress;
            data[`${backup}_mobileNumber`] = backupMod.mobileNumber;
            data[`${backup}_backupMobileNumber`] = backupMod.backupMobileNumber;
            data.isExternal = backupMod.isExternal;

        } catch (err) {
            log.info(`Exception at buildOutputResultforMods with errr: ${err}`);
        }
        result.push(data);
    }
    return result;

};



/****************************************************************************************************************************************** */
/*            Start of the Script 
*********************************************************************************************************************************************
*/
try {
    const TODAYS_DATE = modules.moment().format('YYYY-MM-DD');
    

    const isLoggingEnabled = await globals.global_functions.isLoggingOn();

    if (isLoggingEnabled) {
        log.info('Logging Mode is On');
    }

    //  const check = modules.moment(TODAYS_DATE).isSameOrAfter('2010-10-20', 'day');
    //  const startDate= modules.moment(new Date('01-04-2021')).format('YYYY-MM-DD');

    //Get the header data!
    //DB query to fetch header data
    const all_schedule_headers = await globals.global_functions.genericFetchFromTable(entities.schedule_header);
    if (isLoggingEnabled) {
        log.info("Step 1-Done->Collected All Schedule Headers!");
        log.info(JSON.stringify(all_schedule_headers));
    }

    const matchingScheduleHeaderID = findCurrentDate(all_schedule_headers, TODAYS_DATE);

    if (!matchingScheduleHeaderID) {
        result.data = {
            Error: {
                message: "Failed parsing current weeks schedule_header",
                status: 400
            }
        };
        result.statusCode = "400";
        return complete();
    }

    if (isLoggingEnabled) {
        log.info(`Step 1-Done->Matching schedule header ID is ${matchingScheduleHeaderID}`);
    }

    //get the matching details for that scheduleheaderid
    const schedule_item_fields = [
        "scheduleHeaderID",
        "templateID",
        "moduleID",
        "userID"
    ];


    const matching_schedule_items = await globals.global_functions.genericFetchFromTable(entities.schedule_item, {
        select: schedule_item_fields,
        where: { scheduleHeaderID: matchingScheduleHeaderID }
    });

    //const matching_schedule_items = await fetchScheduleDetails(matchingScheduleHeaderID);
    if (!matching_schedule_items.length) {
        result.data = {
            Error: {
                message: "Failed with no matching record in schedule_item",
                status: 400
            }
        };
        result.statusCode = "400";
        return complete();
    }
    if (isLoggingEnabled) {
        log.info("Step 2-Done->Getting the matching schedule details!");
    }
    //get the matching mods for that scheduleheaderid
    const schedule_header_mods = [
        "scheduleHeaderID",
        "modID",
        "modBackupID"
    ];

    const matching_schedule_mods = await globals.global_functions.genericFetchFromTable(entities.schedule_header_mods, {
        select: schedule_header_mods,
        where: { scheduleHeaderID: matchingScheduleHeaderID }
    });

    if (!matching_schedule_mods.length) {
        result.data = {
            Error: {
                message: "Failed with no matching record in schedule_header_mods",
                status: 400
            }
        };
        result.statusCode = "400";
        return complete();
    }

    if (isLoggingEnabled) {
        log.info("Step 3-Done->Getting the matching schedule Mods!");
    }

    const [allUsers, allTemplates, allModules, allRoles] = await Promise.all([
        globals.global_functions.genericFetchFromTable(entities.users),
        globals.global_functions.genericFetchFromTable(entities.templates),
        globals.global_functions.genericFetchFromTable(entities.modules),
        globals.global_functions.genericFetchFromTable(entities.roles),
    ]);

    if (isLoggingEnabled) {
        log.info(`Step 4-Fetched all the reference data needed: Users,templates,modules`);
    }

    //Join the data with the templates and modules
    const matchingTods = await buildOutputResult(matching_schedule_items, allUsers, allModules, allTemplates, allRoles);


    const matchingMods = await buildOutputResultForMods(matching_schedule_mods, allUsers, allRoles);


    if (isLoggingEnabled) {
        log.info(`Matching Tods:${JSON.stringify(matchingTods)}`);
        log.info(`Matching Mods:${JSON.stringify(matchingMods)}`);
    }

    //Return the result here
    result.data =
    {
        tods: matchingTods,
        mods: matchingMods,
        totalResults: matchingTods.length
    };
} catch (err) {
    log.error(err.message);
    fail();
}

complete();
