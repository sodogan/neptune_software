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


//const all_roles = (await genericFetchFromTable(entities.roles, { where: { name: roleName } }));

var all_roles = [];
const roleName = "Tod";
//Same code like line 24 not in async but in promise based
// Notice that need to start with return otherwise you wont get the response back
genericFetchFromTable(entities.roles, { where: { name: roleName } })
    .then(function (item) {
        console.log(`inside first  promise: ${JSON.stringify(item)}`);
        all_roles.push(item);
       return all_roles;  
    })
    .then(function (item) {
        console.log(`inside second promise: ${JSON.stringify(item)}`);
        complete();     
    })
   .catch(err=>fail());



console.log(`outside the promise:${all_roles}`);

//const all_users = await genericFetchFromTable(entities.users );
//console.log(all_users);

//complete();
