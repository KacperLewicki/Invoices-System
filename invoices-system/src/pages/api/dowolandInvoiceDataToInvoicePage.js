import connection from './lib/db.js';

export default async function handler(req, res) {

    try {
       
        const [invoices] = await connection.query(`SELECT * FROM invoicemanual`);
        
        const invoiceData = await Promise.all(invoices.map(async (invoice) => {
            
            const [items] = await connection.query(

                `SELECT * FROM invoiceitem WHERE nameInvoice = ?`,

                [invoice.nameInvoice]
            );
            return { ...invoice, items };
        }));

        res.status(200).json(invoiceData);

    } catch (error) {

        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: error.message });
    }
}
