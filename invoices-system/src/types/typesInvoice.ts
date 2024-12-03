export interface ItemData {

    nameItem: string;
    quantity: number;
    vatItem: number;
    nettoItem: number;
    bruttoItem: number;
    comment: string;
}

export interface InvoiceData {

    nameInvoice: string;
    dataInvoice: string;
    dataInvoiceSell: string;
    dueDate: string;
    paymentTerm: string;
    comments: string;
    seller: string;
    description: string;
    summaryNetto: number;
    summaryVat: number;
    summaryBrutto: number;
    exchangeRate: number;
    paymentMethod: string;
    effectiveMonth: string;
    documentStatus: string;
    currency: string;
    status: string;
    customerName: string;
}

export interface Invoice {

    nameInvoice: string;
    [key: string]: any;

}

export interface InvoiceContextType {

    loading: boolean;

}

export interface User {

    id: number;
    email: string;
    name: string;
}

export interface AuthContextProps {

    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}


export interface ChangePasswordProps {

    isOpen: boolean;
    onClose: () => void;
}
