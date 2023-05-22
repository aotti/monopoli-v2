const supabase = require('./database')
const { newResponse } = require('./basic')

async function selectAll(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    // get all data from supabase
    const selectAllDataFromDB = async () => {
        const {data, error} = await supabase.from(queryObject.table).select()
        if(error) {
            newResponse(500, res, error)
        }
        return {data: data, error: error}
    }
    return selectAllDataFromDB()
}

async function selectOne(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    // get specific data from supabase
    const selectOneDataFromDB = async () => {
        const {data, error} = await supabase.from(queryObject.table)
                            .select(queryObject.selectColumn)
                            .eq(queryObject.whereColumn, queryObject.whereValue)
        if(error) {
            newResponse(500, res, error)
        }
        return {data: data, error: error}
    }
    return selectOneDataFromDB()
}

async function insertDataRow(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    const insertDataToDB = async () => {
        // insert player data who joined the game
        const {data, error} = await supabase.from(queryObject.table).insert([queryObject.insertColumn])
        if(error) {
            newResponse(500, res, error)
        }
        return {data: data, error: error}
    }
    return insertDataToDB()
}

async function updateData(req, res, queryObject) {
    if(supabase == null)
        return res.send('cannot connect to database')
    const updateDataToDB = async () => {
        const {data, error} = await supabase.from(queryObject.table).update(queryObject.updateColumn).eq(queryObject.whereColumn, queryObject.whereValue)
        if(error) {
            newResponse(500, res, error)
        }
        return {data: data, error: error}
    }
    return updateDataToDB()
}

async function deleteAll(req, res) {

}

module.exports = { 
    selectAll, 
    selectOne, 
    insertDataRow, 
    updateData, 
    deleteAll 
}