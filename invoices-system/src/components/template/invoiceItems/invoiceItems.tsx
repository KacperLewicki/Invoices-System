import React from 'react';
import "./invoiceItems.css";

const invoiceItems = () => {

    return (

        <>
            <h2 className='invoiceItems'>Create Items</h2>

            <input name="nameItem" className='invoiceFormsItems' type='text' placeholder='Item name' />
            <input name="quantity" className='invoiceFormsItems' type="number" placeholder='Quantity' />
            <input name="vatItem" className='invoiceFormsItems' type="number" placeholder='VAT' />
            <input name="nettoItem" className='invoiceFormsItems' type="number" placeholder='Netto' />
            <input name="bruttoItem" className='invoiceFormsItems' type="number" readOnly placeholder='Brutto' />
            <input name="comment" className='invoiceFormsItems' type='text' placeholder='comment' />

            <button className='invoiceTableItemsButton' type='button'>Add Item</button>

            <h2 className='invoiceItems'>Items</h2>

            <table className='invoiceTableItems'>

                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Vat</th>
                        <th>Netto</th>
                        <th>Brutto</th>
                        <th>Comment</th>
                    </tr>

                </thead>
                <tbody>
                </tbody>

            </table>
        </>
    )
}

export default invoiceItems;
