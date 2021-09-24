/*
* This script builds the list of users details based on the role passed as query parameters
* Make sure you pass the roleName parameter
* By default this is intended to get the Mims
*/
//Basic filter function
const filterUsersByRoleID = (allUsers, roleIDFilter) => allUsers.filter((user) => user.roleID === roleIDFilter);


const findLinkageWithUserTemplatesModules = (user_templates_modules, tableID) => {
    let promise = new Promise((resolve, reject) => {
        if (!Array.isArray(user_templates_modules)) {
            reject(new Error('Type mismatch-has to be of Array'));
        }
        let result = user_templates_modules.filter((item) => item.userID == tableID);
        if (!result.length)
            reject(new Error('No data found'));
        resolve(result[0]);
    }
    );
    return promise;
}
//Main function that builds the output.!
const buildOutputResult = async (
    filteredUsers,
    usersTemplatesModules,
    templates,
    modules,
    allUsers
) => {
    "use strict";
    const result = [];
    for (let data of filteredUsers) {
        try {

            let user_template_linkage = await findLinkageWithUserTemplatesModules(usersTemplatesModules, data.id);

            //console.log(`User id ${data.id} templte linkage is ${JSON.stringify(user_template_linkage)} `);
            let matchingTemplates = await globals.global_functions.lookUpWithID(templates, user_template_linkage.templateID);

            //data.templates = { ...matchingTemplates };
            data.templateName = matchingTemplates.name;
            data.templateID = matchingTemplates.id;
            data.templateManagerID = matchingTemplates.templateManagerID;
            //get the templateManager Name from the users
            let matchingTemplateManagers = await globals.global_functions.lookUpWithID(allUsers, data.templateManagerID);
            //data.templateManager = {...matchingTemplateManagers};//if nested needed
            data.templateManagerFirstName = matchingTemplateManagers.firstName;
            data.templateManagerLastName = matchingTemplateManagers.lastName;
            data.templateManagerEmailAddress = matchingTemplateManagers.emailAddress;
            data.templateManagerMobileNumber = matchingTemplateManagers.mobileNumber;
            data.templateManagerBackupMobileNumber = matchingTemplateManagers.backupMobileNumber;

            let matchingModules = await globals.global_functions.lookUpWithID(modules, user_template_linkage.moduleID);
            //data.modules = { ...matchingModules };

            //As module is optional for Mims!-can be empty
            if (matchingModules) {
                let module = await globals.global_functions.lookUpWithID(modules, matchingModules.id);
                data.moduleID = matchingModules.id;
                data.moduleName = module.name;
            }
            else {
                data.moduleName = null;
            }
        } catch (err) {

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

    const isLoggingEnabled = await globals.global_functions.isLoggingOn();

    //make sure that theres parameter passed!
    const query = req.query;
    if (!query.hasOwnProperty('roleName')) {
        result.data = {
            Error: {
                message: "Parameter roleName is missing",
                status: 400
            }
        };
        result.statusCode = 400;
        return complete();
    }

    const roleName = req.query.roleName;

    // const roleName = "Mim";//For Testing
    //Find the matching roleID!
    //Returns an Array get the first one 
    const role = (await globals.global_functions.genericFetchFromTable(entities.roles, { where: { name: roleName } }))[0];
    //if role can not be found return the error message!
    //if (Array.isArray(role) && !role.length) 
    if (!role) {
        result.data = {
            Error: {
                message: "No such roleName found in the Users Templates Modules Table",
                status: 400
            }
        };
        result.statusCode = 400;
        return complete();

    }

    const _roleID = role.id;
    if (isLoggingEnabled) {
        log.info(`Role ID for ${roleName} is ${_roleID} `);
    }

    //Global script will get the main data
    const select = [
        "id",
        "firstName",
        "lastName",
        "emailAddress",
        "mobileNumber",
        "backupMobileNumber",
        "isExternal",
        "roleID"
    ];


    const [allUsers, filteredUsersTemplatesModules, allTemplates, allModules] = await Promise.all([
        globals.global_functions.genericFetchFromTable(entities.users, { select: select }),
        globals.global_functions.genericFetchFromTable(entities.user_template_modules),
        globals.global_functions.genericFetchFromTable(entities.templates),
        globals.global_functions.genericFetchFromTable(entities.modules)
    ]);

    if (isLoggingEnabled) {
        log.info(`Fetched all the reference data needed: Users,templates,modules`);
    }


    const filteredUsers = filterUsersByRoleID(allUsers, _roleID);

    if (isLoggingEnabled) {
        log.info(filteredUsers);
    }
    if (Array.isArray(filteredUsers) && !filteredUsers.length) {
        result.data = {
            Error: {
                message: "No such user found in the Users Table",
                status: 400
            }
        };
        result.statusCode = 400;
        return complete();
    }

    //Join the data with the templates and modules
    result.data = await buildOutputResult(filteredUsers, filteredUsersTemplatesModules, allTemplates, allModules, allUsers);

    if (isLoggingEnabled) {
        log.info(JSON.stringify(result.data));
    }

} catch (err) {
    log.error(err.message);
    return fail();
}


complete();
