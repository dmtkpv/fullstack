// -----------------
// Data
// -----------------

const data = {

    branches: {
        table: 'companies_branches',
        fk: 'branch',
        pk: 'company'
    }

}



// -----------------
// Relations
// -----------------

const relations = {

    v_plans () {
        return this.leftJoin('v_plans', 'v_plans.company', 'companies.id')
    }

}



// -----------------
// Exports
// -----------------

export default {
    data,
    relations
}