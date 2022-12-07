export class AppSettings {
    constructor() {
        this.setCurrentUser = () => this.currentUserPromise.then(user => this.currentUser = user);
        this.setSites = () => this.sitesPromise.then(sites => this.sites = sites);
        this.setDepartments = () => this.departmentsPromise.then(departments => this.departments = departments);
        this.setCompanies = () => this.companiesPromise.then(companies => this.companies = companies);
        this.setNominationCategories = () => this.nominationCategoriesPromise.then(nominationCategories => this.nominationCategories = nominationCategories);
    }
}
//# sourceMappingURL=AppSettings.js.map