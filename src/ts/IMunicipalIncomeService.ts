export interface IMunicipalIncomeService {
    get5YearsIncomeByCounty(county: any, culture: any): Promise<any>
    get5YearsCornIncome(county: string, culture: string): Promise<any>
    get5YearsSoyIncome(county: string, culture: string): Promise<any>
    get10YearsIncomeByCounty(county: any, culture: any, harvestYears: string[]): Promise<any>
    get10YearsSoyIncome(county: string, culture: string, harvestYears: string[]): Promise<any>
    get10YearsCornIncome(county: string, culture: string, harvestYears: string[]): Promise<any>
}