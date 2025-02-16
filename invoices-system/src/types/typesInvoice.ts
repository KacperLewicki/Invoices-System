export interface AuditLog {

    id: number;
    table_name: string;
    row_id: number;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    old_data: any;
    new_data: any;
    changed_at: string;
    changed_by?: string;

}

export interface Message {

    id: number;
    content: string;
    timestamp: string;
    sender: 'Admin' | 'System';
}

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
    identyfikator: string;
    customerName: string;
}

export interface CreditNoteItemData {

    id?: number;
    creditNoteId?: number;
    itemName: string;
    quantity: number;
    nettoItem: number;
    vatItem: number;
    bruttoItem: number;
}

export interface CreditNoteData {

    creditNote: string;
    invoiceName: string;
    dataInvoice: string;
    dataInvoiceSell: string;
    dueDate: string;
    paymentTerm: string;
    comments: string;
    seller: string;
    summaryNetto: number;
    summaryBrutto: number;
    summaryVat: number;
    customerName: string;
    description: string;
    exchangeRate: number;
    paymentMethod: string;
    effectiveMonth: string;
    documentStatus: string;
    identyfikator: string;
    currency: string;
    items: CreditNoteItemData[];
}

export interface Invoice {

    nameInvoice: string;
    [key: string]: any;

}

export interface InvoiceContextType {

    loading: boolean;

}

export interface User {

    id: string;
    name: string;
    email: string;
    identyfikator: string;
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
