export interface PaymentItem {
    title: string;
    description: string;
    price: number;
    quantity: number;
    deadline: string;
}
export type PaymentArrangement = 'default' | 'outstanding';

export type PaymentCardSize = 'small' | 'medium' | 'large';

export type NavigationBarNaming = 'original' | 'new';

export interface IVConfig {
    paymentArrangement: PaymentArrangement;
    paymentCardSize: PaymentCardSize;
    navigationBarNaming: NavigationBarNaming;
}
