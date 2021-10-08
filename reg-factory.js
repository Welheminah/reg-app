module.exports = function regPlate(pool) {

    
    async function addReg(regNum) {
        var registration = regNum.trim().toUpperCase();
        var tag = registration.substring(0, 2);
        

        const townId = await getTownId(tag);
        var dbName = await pool.query('SELECT reg_no FROM the_reg_numbers WHERE reg_no = $1', [registration]);
        if(dbName.rowCount === 0){
            await pool.query('INSERT INTO the_reg_numbers(reg_no, towns_id) VALUES($1, $2)', [registration, townId])
        }
    };



    async function getTownId(reg_mark) {
        var townId = await pool.query("SELECT id FROM the_towns where reg_mark = $1", [reg_mark])
        return townId.rows[0].id;
    };


    async function getReg() {
        var plates = await pool.query('SELECT * FROM the_reg_numbers');
        return plates.rows;
    };


    async function addTown(town, regMark) {
        await pool.query('INSERT INTO the_towns(town, regMark) VALUES ($1, $2)', [town, regMark])
    };


    async function getRegistrationNumbers(townId) {
        var getAllReg = await pool.query('SELECT * FROM the_reg_numbers WHERE towns_id = $1', [townId]);
        return getAllReg.rows;

    };


    async function filterReg(radioBtn) {

        var registrations = await getReg();

        if (radioBtn === "ALL") {
            return registrations
        }

        var townId = await getTownId(radioBtn);
        var sortTown = await getRegistrationNumbers(townId);
        return sortTown;

    };


    async function clear() {
        reset = await pool.query('DELETE FROM the_reg_numbers');
        return reset;
    };

    return {
        addReg,
        filterReg,
        getReg,
        clear,
        addTown,
        getTownId
    }
}