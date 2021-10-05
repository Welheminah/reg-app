module.export = function (regInstance) {

    async function homeIndex() {
        const regList = await regInstance.getReg()
        res.render("index", {
            regNumbers: regList
        });
    }

    return{
        homeIndex
    }
}
