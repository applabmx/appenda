export interface RegisterRequestModel{
    name: string
    last_name: string
    cell_phone: string
    email: string
    password: string
    password_confirm: string
    acept_terms?: boolean
}