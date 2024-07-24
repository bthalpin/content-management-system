declare global {
    type User = {
        user_id: number;
        name: string;
        email: string;
        phone?: string;
        company_name?: string;
        stripe_customer_id?: string;
        is_pending?: boolean;
        is_admin?: boolean;
        has_upload_permissions?: boolean;
        password: string;
        salt: string;
    }
}

export default global;