const supabase = require('./database')

async function selectAll(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    // get all data from supabase
    const selectAllDataFromDB = async () => {
        const {data, error} = await supabase.from(queryObject.table).select(queryObject.selectColumn).order('id', {ascending: true})
        return {data: data, error: error}
    }
    return selectAllDataFromDB()
}

async function selectOne(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    // get specific data from supabase
    const selectOneDataFromDB = async () => {
        // multiple where condition
        if(queryObject.multipleWhere === true) {
            const {data, error} = await supabase.from(queryObject.table)
                                .select(queryObject.selectColumn)
                                .eq(queryObject.whereColumn_One, queryObject.whereValue_One)
                                .eq(queryObject.whereColumn_Two, queryObject.whereValue_Two)
            return {data: data, error: error}
        }
        // only one where condition
        else if(queryObject.multipleWhere === false) {
            const {data, error} = await supabase.from(queryObject.table)
                                .select(queryObject.selectColumn)
                                .eq(queryObject.whereColumn, queryObject.whereValue)
            return {data: data, error: error}
        }
    }
    return selectOneDataFromDB()
}

async function insertDataRow(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    const insertDataToDB = async () => {
        // insert player data who joined the game
        const {data, error} = await supabase.from(queryObject.table).insert([queryObject.insertColumn])
        return {data: data, error: error}
    }
    return insertDataToDB()
}

async function updateData(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    const updateDataToDB = async () => {
        // multiple where condition
        if(queryObject.multipleWhere === true) {
            const {data, error} = await supabase.from(queryObject.table)
                                .update(queryObject.updateColumn)
                                .eq(queryObject.whereColumn_One, queryObject.whereValue_One)
                                .eq(queryObject.whereColumn_Two, queryObject.whereValue_Two)
            return {data: data, error: error}
        }
        // only one where condition
        else if(queryObject.multipleWhere === false) {
            const {data, error} = await supabase.from(queryObject.table)
                                .update(queryObject.updateColumn)
                                .eq(queryObject.whereColumn, queryObject.whereValue)
            return {data: data, error: error}
        }
    }
    return updateDataToDB()
}

async function deleteAll(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    const deleteDataFromDB = async () => {
        const {data, error} = await supabase.from(queryObject.table).delete().neq('id', 0)
        return {data: data, error: error}
    }
    return deleteDataFromDB()
}

module.exports = { 
    selectAll, 
    selectOne, 
    insertDataRow, 
    updateData, 
    deleteAll 
}