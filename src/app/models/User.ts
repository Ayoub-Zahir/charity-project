export interface User{
    uid: string,
    email: string,
    role: string,
    fullName: string,
    imgURL: string,
    phone: string,
    creationDate?: Date,
    lastSigninTime?: Date,
    defaultImg?: string,
    disabled?: boolean
}