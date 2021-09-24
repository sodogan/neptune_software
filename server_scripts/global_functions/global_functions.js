//Example code: const all_roles = await genericFetchFromTable(entities.roles,{ select:["id","name"],where:{ name :"Tod" }  });
/*
* This script builds the list of users details based on the role passed as query parameters
* Make sure you pass the roleName parameter
* By default this is intended to get the Mims
*/

const isLoggingOn = () => false;

//Generic fetch function select and filter are optional!
// genericgenericFetchFromTable(entities.roles, { select: ["id", "name"] }),
// genericgenericFetchFromTable(entities.users, { select: ["id", "name"],where: { firstName: "AMG" } })
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



complete({
    isLoggingOn,
    genericFetchFromTable,
    lookUpWithID,
});

