import connection from './lib/db';

export default async function handler(req, res) {

  //console.log('Rozpoczęcie handlera');

  if (req.method !== 'POST') {

    return res.status(405).send('Metoda niedozwolona');
  }

  try {
    const { invoice, items } = req.body;

    //console.log('Otrzymane dane:', { invoice, items });

    if (!invoice || !items || !Array.isArray(items)) {

      //console.log('Nieprawidłowe dane wejściowe');

      return res.status(400).send('Nieprawidłowe dane wejściowe');
    }

    const db = connection;

    //console.log('Pobieranie ostatniej faktury');

    const getLastInvoiceQuery = 'SELECT nameInvoice FROM invoicemanual ORDER BY id DESC LIMIT 1';
    const [lastInvoiceResult] = await db.execute(getLastInvoiceQuery);

    //console.log('Ostatnia faktura:', lastInvoiceResult);

    let lastInvoiceName = 0;

    if (lastInvoiceResult.length > 0 && lastInvoiceResult[0].nameInvoice) {

      const lastInvoice = lastInvoiceResult[0].nameInvoice;
      const lastName = parseInt(lastInvoice.split('/').pop(), 10); //zwracam ostatnią liczbę z nazwy faktury (split.pop() -> po "/" -> 4 ostatnie znaki)
      lastInvoiceName = isNaN(lastName) ? 0 : lastName;
    }

    const newInvoiceNumber = lastInvoiceName + 1;
    const newInvoiceNumberStr = newInvoiceNumber.toString().padStart(4, '0');
    const generatedNameInvoice = `NB/24/${newInvoiceNumberStr}`;
    invoice.nameInvoice = generatedNameInvoice;

    const validInvoiceFields = {
      nameInvoice: invoice.nameInvoice,
      dataInvoice: invoice.dataInvoice,
      dataInvoiceSell: invoice.dataInvoiceSell,
      dueDate: invoice.dueDate,
      paymentTerm: invoice.paymentTerm,
      comments: invoice.comments,
      seller: invoice.seller,
      description: invoice.description,
      summaryNetto: invoice.summaryNetto,
      summaryVat: invoice.summaryVat,
      summaryBrutto: invoice.summaryBrutto,
      exchangeRate: invoice.exchangeRate,
      paymentMethod: invoice.paymentMethod,
      effectiveMonth: invoice.effectiveMonth,
      documentStatus: invoice.documentStatus,
      currency: invoice.currency,
      status: invoice.status,
      customerName: invoice.customerName,
    };

    for (const [key, value] of Object.entries(validInvoiceFields)) {

      if (value === undefined || value === null) {

        //console.log(`Brakujące pole: ${key}`);

        return res.status(400).send(`Pole ${key} jest wymagane.`);
      }
    }

    //console.log('Zapisywanie faktury');

    const fields = Object.keys(validInvoiceFields); //pobieram kluczy z obiektu validInvoiceFields
    const placeholders = fields.map(() => '?').join(', '); // stworzenie stringa z ? dla zapytania SQL
    const values = Object.values(validInvoiceFields); //pobieram wartości z obiektu validInvoiceFields

    const saveInvoiceQuery = `INSERT INTO invoicemanual (${fields.join(', ')}) VALUES (${placeholders})`;

    await db.execute(saveInvoiceQuery, values);

    //console.log('Faktura zapisana');

    if (items.length > 0) {

      //console.log('Zapisywanie pozycji faktury');

      const itemsValues = items.map(item => [

        invoice.nameInvoice,
        item.nameItem,
        item.quantity,
        item.vatItem,
        item.nettoItem,
        item.bruttoItem,
        item.comment,
      ]);

      const sqlItems = 'INSERT INTO invoiceitem (nameInvoice, nameItem, quantity, vatItem, nettoItem, bruttoItem, comment) VALUES ?';

      await db.query(sqlItems, [itemsValues]);

      //console.log('Pozycje faktury zapisane');
    }

    //console.log('Wysyłanie odpowiedzi');

    res.status(200).json({ nameInvoice: invoice.nameInvoice });

  } catch (error) {

    //console.error('Błąd podczas przetwarzania żądania:', error);

    res.status(500).send(`Błąd podczas przetwarzania żądania: ${error.message}`);
  }
}
