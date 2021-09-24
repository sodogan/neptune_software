//Wrapping up all the logic inside Object mOptions
// genericFetchFromTable(entities.roles, { select: ["id", "name"] }),
// genericFetchFromTable(entities.users, { where: { firstName: "AMG" } })
const genericFetchFromTable = async (tableName, mOptions) => {
    const table = tableName;
    let options = {};

    if (!mOptions) {
        return await table.find(options);
    }
    if (mOptions.select) {
        options.select = mOptions.select;
    }
    if (mOptions.where) {
        options.where = {};
        options.where = mOptions.where;
    }

    return await table.find(options);

}


const fetchUsersByRoleID = async (roleIDFilter) => {
    const table = entities.users;
    let options = {};
    if (roleIDFilter) {
        options.where = {};
        options.where.roleID = roleIDFilter;
    }
    const result = await table.find(options);

    return result;

}
//Basic filter function
const filterUsersByRoleID = (allUsers, roleIDFilter) => {

    return allUsers.filter((user) => user.roleID === roleIDFilter);

}


//Promise to find the role ID with the role Name
const findRoleID = async (allUsers, roleNameForMod) => {
    return new Promise((resolve, reject) => {
        const result = allUsers.filter((item) => item.name == roleNameForMod);
        if (!result.length) {
            reject(new Error("Could not find the role"))
        }
        resolve(result[0]);
    });

}


const findLinkageWithUserTemplatesModules = async (user_templates_modules, tableID) => {
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





//Find the matching ID
const lookUpWithID = (anyArray, anyID) => {
    let promise = new Promise((resolve, reject) => {
        if (!Array.isArray(anyArray)) {
            reject(new Error('Type mismatch-has to be of Array'));
        }
        let result = anyArray.filter((item) => item.id == anyID);
        if (!result.length)
            reject(new Error('No data found'));
        resolve(result[0]);
    }
    );
    return promise;
}


/*  Start of the Script */
try {

    //Global script will get the main data
    const allRoles = await genericFetchFromTable(entities.roles);

    const roleNameForMod = "Mod";
    const roleNameForTod = "Tod";
    const roleNameForTemplateManager = "templateManager";


    //let modRoleID, todRoleID;
    //Now find the role ID from the name!

    //Find the matching roleID for Mod!
    const { id: modRoleID } = await findRoleID(allRoles, roleNameForMod);

    //Find the matching roleID for Tod!
    const { id: todRoleID } = await findRoleID(allRoles, roleNameForTod);

    //Find the matching roleID for Tod!
    const { id: templateManagerRoleID } = await findRoleID(allRoles, roleNameForTemplateManager);


    if (!modRoleID || !todRoleID) {
        result.data = {
            Error: {
                message: 'No role found for the Name Tod or Mod',
                status: 400
            }
        };
        result.statusCode = 400;
        return complete();

    }


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



    const allUsers = await genericFetchFromTable(entities.users, { select: select });
    log.info("Step 1-Done->Collected All Users!");


    const filteredUsersMod = filterUsersByRoleID(allUsers, modRoleID);
    console.log(filteredUsersMod);

    const filteredUsersTemplateManager = filterUsersByRoleID(allUsers, templateManagerRoleID);
    console.log(filteredUsersTemplateManager);

    const filteredUsersTod = filterUsersByRoleID(allUsers, todRoleID);
    console.log(filteredUsersTod);



    let allTemplates = await genericFetchFromTable(entities.templates);
    log.info("Step 2-Done->Collected All Templates!");
    log.info(JSON.stringify(allTemplates));

    let allModules = await genericFetchFromTable(entities.modules);
    log.info("Step 3-Done->Collected All Modules!");
    log.info(JSON.stringify(allModules));


    //Join the data with the templates and modules
    result.data = {
        //filteredUsersMod,
        filteredUsersTemplateManager,
        filteredUsersTod,
        allTemplates,
        allModules
    };



} catch (err) {
    result.data = {
        Error: {
            message: err.message,
            status: 400
        }
    };
    result.statusCode = 400;
    return complete();

}


complete();
