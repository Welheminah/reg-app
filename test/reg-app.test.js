const assert = require('assert');
const regFactory = require('../reg-factory');
const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/my_products_test';

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
        
       
        assert.equal('CA 12345', regFunction.addReg());

    });

    after(function(){
        pool.end();
    })
});