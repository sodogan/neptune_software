/*
* This script will fetch all data from user_templates_modules table
* Intended to get Tods only!
* Then joins it with the matching name with the templates and modules tables
* Sample Body request at the POST
*With only templates
*{     
*  "templates":  [ 
*        {"id":"7ca809a7-1979-480d-86a2-bd47c25220d7"},
*        {"id":"4b8be55a-b1cb-412a-a2ae-03624e534525"},
*        {"id":"7ca809a7-1979-480d-86a2-bd47c25220d7"},
*        {"id":"1f3e46da-5d87-44aa-adad-b7cd48b55008"}
*      ]
*}  
* with templates and modules
{
"templates":[ 
*                   {"id":"7ca809a7-1979-480d-86a2-bd47c25220d7"},
*                   {"id":"4b8be55a-b1cb-412a-a2ae-03624e534525"},
*                   {"id":"7ca809a7-1979-480d-86a2-bd47c25220d7"},
*                   {"id":"1f3e46da-5d87-44aa-adad-b7cd48b55008"}
*                    ],
* "modules":[
*          {"id": "bbae8d5d-6471-46d3-8f50-37de416a3c89"},
*          {"id":"fa7aa53c-fa3e-4152-8ac2-ce06c2886955"}
*     ]          
*}
 */

//Check if logging is enabled!
const isLoggingEnabled = await globals.global_functions.isLoggingOn();

const filterUsersTemplatesDataWithTemplateID = (allUsersTemplatesModules, filterArray) => {
    const result = [];

    //filter the result based on the templateFilter
    for (let item of allUsersTemplatesModules) {
        let isExist = filterArray.filter((filterData) => item.templateID == filterData.id);
        if (isExist.length)
            result.push(item);
    }
    return result;
}

const filterUsersTemplatesDataWithModuleID = (allUsersTemplatesModules, filterArray) => {
    const result = [];

    //filter the result based on the templateFilter
    for (let item of allUsersTemplatesModules) {
        let isExist = filterArray.filter((filterData) => item.moduleID == filterData.id);
        if (isExist.length)
            result.push(item);
    }
    return result;
}

//Main function that builds the output.!
const buildOutputResult = async (
    allUsersTemplatesModules,
    users,
    modules,
    templates,
    roles
) => {
    "use strict";
    const result = [];
    for (let data of allUsersTemplatesModules) {

        try {
            let template = await  globals.global_functions.lookUpWithID(templates, data.templateID);
            data.templateName = template.name;
            data.templateManagerID = template.templateManagerID;
            //get the templateManager Name from the users
            let templateManager = await  globals.global_functions.lookUpWithID(users, data.templateManagerID);
            //data.templateManager = {...templateManager};//if nested needed
            data.templateManagerFirstName = templateManager.firstName;
            data.templateManagerLastName = templateManager.lastName;
            data.templateManagerEmailAddress = templateManager.emailAddress;
            data.templateManagerMobileNumber = templateManager.mobileNumber;
            data.templateManagerBackupMobileNumber = templateManager.backupMobileNumber;

            //As module is optional for Mims!-can be empty
            if (data.moduleID) {
                let module = await  globals.global_functions.lookUpWithID(modules, data.moduleID);
                data.moduleName = module.name;
            }
            else {
                data.moduleName = null;
            }
            //lookup the user matching with todID
            let user = await  globals.global_functions.lookUpWithID(users, data.userID);
            data.firstName = user.firstName;
            data.lastName = user.lastName;
            data.emailAddress = user.emailAddress;
            data.mobileNumber = user.mobileNumber;
            data.backupMobileNumber = user.backupMobileNumber;
            data.isExternal = user.isExternal;
            data.roleID = user.roleID;
            data.managerID = user.managerID;
            let { name: roleName } = await  globals.global_functions.lookUpWithID(roles, data.roleID);
            data.roleName = roleName;
        } catch (err) {
           log.info(`Exception at buildOutputResult with errr: ${err}`);
        }
        //mkaya added 1 line *Simay'ın talebi üzerine eklendi - 03052021
        if (data.roleName === "Tod")
            result.push(data);
    }
    return result;

};

const validate_data = (anyArray, error_msg) => {
    if (Array.isArray(anyArray) && !anyArray.length) {
        result.data = {
            Error: {
                message: error_msg,
                status: 400
            }
        };
        result.statusCode = 400;
        return complete();

    }
}

/****************************************************************************************************************************************** */
/*            Start of the Script 
*********************************************************************************************************************************************
*/
try {

    let parsedResult = [];

    if (!req.body.templates) {
        result.data = {
            Error: {
                message: "Request Body- Templates is missing!",
                status: 400
            }
        };
        result.statusCode = "400";
        return complete();
    }

    const templateFilter = req.body.templates;

    const fields =
        [
            "id",
            "userID",
            "templateID",
            "moduleID"
        ];
    const allUsersTemplatesModules = await globals.global_functions.genericFetchFromTable(entities.user_template_modules, { select: fields });
    validate_data(allUsersTemplatesModules,"No resource assigned for that template. Please select another template(s).");
  
    if (isLoggingEnabled) {
        log.info("Step 1-Done->Collected The Users Templates Modules!");
        log.info(JSON.stringify(allUsersTemplatesModules));
    }
    //Filter the data based on the template IDs from the search criteria
    let filteredUsersTemplatesModules = filterUsersTemplatesDataWithTemplateID(allUsersTemplatesModules, templateFilter);
    validate_data(filteredUsersTemplatesModules,"No resource assigned for that template. Please select another template(s).");

    //If the module is sent as a search parameter include it to the filter
    if (req.body.modules) {
        const moduleFilter = req.body.modules;
        filteredUsersTemplatesModules = filterUsersTemplatesDataWithModuleID(filteredUsersTemplatesModules, moduleFilter);
    }
    if (isLoggingEnabled) {
        log.info("Step 2-Done->Filtered  The Users Templates Modules!");
        log.info(JSON.stringify(filteredUsersTemplatesModules));
    }
  
    //Get all the reference data!
    const [allUsers, allTemplates, allModules,allRoles] = await Promise.all([
        globals.global_functions.genericFetchFromTable(entities.users),
        globals.global_functions.genericFetchFromTable(entities.templates),
        globals.global_functions.genericFetchFromTable(entities.modules),
        globals.global_functions.genericFetchFromTable(entities.roles),
    ]);

     if (isLoggingEnabled) {
        log.info(`Step 3-Done->Fetched all the reference data needed: Users,templates,modules`);
        log.info(JSON.stringify(allModules));
    }
    

    //Join the data with the templates and modules
    parsedResult = await buildOutputResult(filteredUsersTemplatesModules, allUsers, allModules, allTemplates, allRoles);
    if (isLoggingEnabled) {
        log.info(JSON.stringify(parsedResult));
    }
    result.data =
    {
        searchResult: parsedResult,
        totalResults: parsedResult.length
    };
} catch (err) {

    log.error(err.message);
    return fail();
}


complete();



