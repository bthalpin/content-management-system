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

    type Subscription = {
        subscription_id: number;
        user_id: number;
        stripe_subscription_id: string;
        status: string;
        modified_date: Date;
        create_date: Date;
        last_billing_date: Date;
        next_billing_date: Date;
    }

    type Transaction = {
        transaction_id: number;
        stripe_charge_id: string;
        subscription_id: number;
        payment_date: Date;
        status: string;
        invoice_link: string;
        modified_date: Date;
    }
}

export default global;