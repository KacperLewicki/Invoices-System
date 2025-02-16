'use client';

import React from 'react';
import { AuditLog } from '../../../types/typesInvoice';
import { getDetailedChanges } from '../../../utils/auditLogs/auditLogs';

function DetailedPanel({

    log,
    onClose,

}: {

    log: AuditLog;
    onClose: () => void;

}) {

    const changes = getDetailedChanges(log);

    let title = 'Added new record:';
    let titleColor = 'text-purple-700';

    if (log.action === 'DELETE') {

        title = 'Deleted record:';
        titleColor = 'text-red-700';

    } else if (log.action === 'UPDATE') {

        title = 'Updated record:';
        titleColor = 'text-blue-700';
    }

    return (

        <div className="mt-6 p-6 bg-gray-50 border border-gray-300 rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${titleColor}`}>{title}</h2>
                <button className="text-sm text-gray-600 hover:text-gray-900" onClick={onClose}> Close </button>
            </div>

            {changes.length === 0 ? (<p className="text-base text-gray-600">No changes in fields.</p>) : (<ul className="space-y-2">
                {changes.map((c) => (
                    <li key={c.field} className="text-base text-gray-700">
                        <strong className="mr-2">{c.field}:</strong>
                        {log.action === 'INSERT' && (<span><em>{String(c.newValue)}</em> </span>)}
                        {log.action === 'DELETE' && (<span> Old value: <em>{String(c.oldValue)}</em> </span>)}
                        {log.action === 'UPDATE' && (<span> {String(c.oldValue)} &rarr; {String(c.newValue)} </span>)}
                    </li>
                ))}
            </ul>
            )}
        </div>
    );
}

export default DetailedPanel;