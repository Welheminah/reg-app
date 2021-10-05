module.exports = function regPlate(pool) {
    var msg = "";

    var platesStore = [] ;
    
    async function addReg(regNum){
        var registration = regNum.trim().toUpperCase();
        var tag = registration.substring(0,2);

        const townId = await getTownId(tag); 
        await pool.query('INSERT INTO the_reg_numbers(reg_no, towns_id) VALUES($1, $2)', [registration, townId])
        msg = "RegNo sucessfully added";
    }

    async function getTownId(reg_mark){
       var townId = await pool.query ("SELECT id FROM the_towns where reg_mark = $1", [reg_mark])
       return townId.rows[0].id
    }

    async function getReg(){
        var plates = await pool.query('SELECT * FROM the_reg_numbers');
        return plates.rows;
    }



    async function addTown(town, regMark){
        await pool.query('INSERT INTO the_towns(town, regMark) VALUES ($1, $2)',[town, regMark])
    }

    //  function numberPlates(registration){
    
    //     var registration = registration.trim().toUpperCase();
    //     var type =  /^((CJ|CL|CA)\-([0-9]){3}\-([0-9]){3})$/;
    //     var type2 = /^((CJ|CL|CA)\s([0-9]){3}\s([0-9]){3})$/;
    //     // var type3 = /^(CJ|CL|CA)\-[0-9]{5}$/;
    //     // var type4 = /^(CJ|CL|CA)\s[0-9]{5}$/;
    //     var letsValidate = type.test(registration);
    //     var letsValidate2 = type2.test(registration);
    //     // var letsValidate3 = type3.test(registration);
    //     // var letsValidate4 = type4.test(registration);

       

    //     if(letsValidate || letsValidate2){
    //         if(!platesStore.includes(registration)){
    //             platesStore.push(registration);
    //             console.log(platesStore);
    //             return registration;
    //         } 
    //         else if(platesStore.includes(registration)){
    //             return "The registration entered already exist";
    //         }
        
    //     }
    //     else {
    //         return "Invalid regitration, please enter a valid registration eg CA 123 045";
    //     } 
    // }




    function storings(){
        return platesStore;
    }
    async function getRegistrationNumbers(townId) {
        var getAllReg = await pool.query('SELECT * FROM the_reg_numbers WHERE towns_id = $1', [townId]);
        return getAllReg.rows;
    
    }
    
   async function filterReg(radioBtn){
        var filteredReg = [];
        var registrations = await getReg();

        if(radioBtn === "ALL"){
            return registrations
        }

        var townId = await getTownId(radioBtn);
        var sortTown = await getRegistrationNumbers(townId);
        return sortTown;
        
    }
    

    async function clear(){
        reset = await pool.query('DELETE FROM the_reg_numbers');
        return reset;
    }

    return {
        // numberPlates,
        filterReg,
        storings,
        getReg,
        addReg,
        clear,
        addTown,
        getTownId
        // theTown
    }
}