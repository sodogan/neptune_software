const fetchMatchingUsers = async (roleName) => {
    var fields = [
        "users.firstName as firstName",
        "users.lastName as lastName",
        "users.roleID as roleID",
        "roles.name as name"
    ];

    const result = await entities.users.createQueryBuilder("users")
        .select(fields)
        .leftJoin("roles", "roles", "roles.id = users.roleID")
        .where("roles.name = :roleName", { roleName: roleName })
        .getRawMany();

    return result;
}


try {
    let parsedResult = [];
    //Global script will get the main data
    let filteredUsers = await fetchMatchingUsers('Mim');
    console.log(filteredUsers);
    if (Array.isArray(filteredUsers) && !filteredUsers.length) {
        result.data = parsedResult;
        log.info("!!Exited->No data in the Users Templates Modules Table!");
        return complete();
    }

} catch (err) {
    log.error(err.message);
    fail();
}


complete();

