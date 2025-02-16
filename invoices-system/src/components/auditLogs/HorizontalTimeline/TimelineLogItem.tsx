'use client';

import React from 'react';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { AuditLog } from '../../../types/typesInvoice';

function TimelineLogItem ({

    log,
    onSelect,

}: {

    log: AuditLog;
    onSelect: (log: AuditLog) => void;

}) {

    let IconComponent = FaPlusCircle;
    if (log.action === 'UPDATE') IconComponent = FaEdit;
    if (log.action === 'DELETE') IconComponent = FaTrash;

    const timeStr = new Date(log.changed_at).toLocaleTimeString();
    const label = `${log.action} — ${timeStr}`;

    return (

        <div className="relative flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer" onClick={() => onSelect(log)}>
                <IconComponent className="w-6 h-6 block" />
            </div>
            <div className="mt-2 text-sm text-gray-700 text-center">{label}</div>
        </div>
    );
}

export default TimelineLogItem;