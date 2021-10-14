const assert = require('assert');
const regPlate = require('../reg-factory');
const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests

const connectionString = process.env.DATABASE_URL || 'postgresql://codexx:pg123@localhost:5432/my_reg_test';

const pool = new Pool({
    connectionString
});

describe('The registration numbers web app', function(){

    beforeEach(async function(){
       
        await pool.query("delete from the_reg_numbers;");
        
    });

    it('should be to take the reg number entered and print it out', async function(){
        
        
        let regFunction = regPlate(pool);
        await regFunction.addReg('CA 12345')

        var theGetReg = await regFunction.getReg();
        var set = theGetReg[0].reg_no;
        assert.equal('CA 12345', set);
        // assert.deepEqual([ { id: 16, reg_no: 'CA 12345', towns_id: 1 } ], theGetReg)

    });

    it('should be to take the reg number entered and print it out', async function(){
        
        
        let regFunction = regPlate(pool);
        await regFunction.addReg('cl 123 123')

        var theGetReg = await regFunction.getReg();
        var set = theGetReg[0].reg_no;
        assert.equal('CL 123 123', set);

    });

    it('should be to take the reg number entered and print it out', async function(){
        
        
        let regFunction = regPlate(pool);
        await regFunction.addReg('cJ 123 745')
        await regFunction.addReg('cJ 123 745')


        var theGetReg = await regFunction.getReg();
        var set = theGetReg[0].reg_no;
        assert.equal('CJ 123 745', set);
        

    });

    it('should be able to return the town id as 1 if the the registration is from Cape Town', async function(){
        
        
        let regFunction = regPlate(pool);
        await regFunction.addReg('CA 12345')

        var theGetId = await regFunction.getReg();
        
        var getId = theGetId[0].towns_id;
        assert.equal(1, getId);
        

    });
    it('should be able to return the town id 3 if the registration number is from Paarl ', async function(){
        
        
        let regFunction = regPlate(pool);
        await regFunction.addReg('Cl 12345')

        var theGetId = await regFunction.getReg();
        var getId = theGetId[0].towns_id;
        assert.equal(3, getId);
        

    });

    it('should be able to return the town id 2 if the registration number is from Stellenbosch ', async function(){
        
        
        let regFunction = regPlate(pool);
        await regFunction.addReg('Cj 12345')

        var theGetId = await regFunction.getReg();
        var getId = theGetId[0].towns_id;
        assert.equal(2, getId);
        

    });

    it('should be able to clear the table', async function(){

        let regFunction = regPlate(pool);

        await regFunction.addReg('Cj 12345')
        await regFunction.addReg('CA 123 945')
        await regFunction.addReg('CL 746 045')
        await regFunction.addReg('Cj 983 254')

        let reset = await regFunction.clear();


        assert.equal(0, reset.rows.length)
        

    });
    it('should be able to filter by the town selected by the user, return all the registrations from Cape Town if the regNo starts with CA', async function(){

        let regFunction = regPlate(pool);

        await regFunction.addReg('Cj 12345')
        await regFunction.addReg('CA 123 945')
        await regFunction.addReg('CL 746 045')
        await regFunction.addReg('Cj 983 254')

        var filter = await regFunction.filterReg('CA')
        var filterSet = filter[0].towns_id;
        assert.equal(1, filterSet)

    });

    it('should be able to filter by the town selected by the user,return all the registrations from Stellenbosch if the regNo starts with CL', async function(){

        let regFunction = regPlate(pool);

        await regFunction.addReg('Cj 12345')
        await regFunction.addReg('CA 123 945')
        await regFunction.addReg('CL 746 045')
        await regFunction.addReg('Cj 983 254')

        var filter = await regFunction.filterReg('CL')
        var filterSet = filter[0].towns_id;
    
        assert.equal(3, filterSet)

    });

    
    after(function(){
        pool.end();
    })
});