
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



try{

const all_roles = await genericFetchFromTable(entities.roles,{ select:["id","name"],where:{ name :"Tod" }  });

console.log(all_roles);

}catch(err){
    console.log(err);
}