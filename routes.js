module.exports =  function (regInstance) {

    async function homeIndex (req, res) {
        const regList = await regInstance.getReg()
        var msg = req.flash("error");
        res.render("index", {
            regNumbers: regList,
            messages : msg
        });
    };

    async function theRegNo(req, res){
        const numPlate = req.body.regNo.trim().toUpperCase();
        var type = /^((CJ|CL|CA)\s([0-9]){3}\s([0-9]){3})$/;
        var type2 = /^(CJ|CL|CA)\s[0-9]{5}$/;
        var letsValidate = type.test(numPlate);
        var letsValidate2 = type2.test(numPlate);
        if (numPlate === "") {
            req.flash('error', 'The registration cannot be empty');
            res.redirect('/')
        }
        if (letsValidate === true || letsValidate2 === true) {
            await regInstance.addReg(numPlate);
        } 
    
         else {
            req.flash('error', 'Invalid regitration, please enter a valid registration eg CA 123 045')
            res.redirect('/')
        };
        // console.log(numPlate);
        res.redirect('/');
    };

    async function letFilter(req, res){
        const regs = req.body.town;

    const regFilter = await regInstance.filterReg(regs);
    console.log(regFilter);
    res.render('index', {
        regFilter,
        messages : ""
    })
    };

    async function theReset(req, res){
        await regInstance.clear()
    res.redirect('/');

    }


    async function flashMsg(req, res){
        const numPlate = req.body.regNo.trim().toUpperCase();
    if (numPlate === "") {
        req.flash('error', 'The registration cannot be empty');
        res.redirect('/')
    } else {
        req.flash('error', 'Invalid regitration, please enter a valid registration eg CA 123 045');
        res.redirect('/')
    }

    }

    return{
        homeIndex,
        theRegNo,
        letFilter,
        theReset,
        flashMsg
    }
};