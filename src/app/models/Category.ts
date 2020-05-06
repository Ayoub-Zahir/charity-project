enum Types { 'costPerUnit', 'fixedCost', '' };

export interface Category{
    id?:string,
    name: string,
    type: string,
    description: string
}