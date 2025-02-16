import { AuditLog } from '../../types/typesInvoice';

export function getDetailedChanges(log: AuditLog) {

    const oldObj = typeof log.old_data === 'string'

        ? JSON.parse(log.old_data || '{}')
        : log.old_data || {};

    const newObj = typeof log.new_data === 'string'

        ? JSON.parse(log.new_data || '{}')
        : log.new_data || {};

    if (log.action === 'INSERT') {

        return Object.entries(newObj).map(([field, value]) => ({

            field,
            oldValue: undefined,
            newValue: value,
        }));
    }

    if (log.action === 'DELETE') {

        return Object.entries(oldObj).map(([field, value]) => ({

            field,
            oldValue: value,
            newValue: undefined,
        }));
    }

    const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    allKeys.forEach((key) => {

        const oldVal = oldObj[key];
        const newVal = newObj[key];

        if (oldVal !== newVal) {

            changes.push({ field: key, oldValue: oldVal, newValue: newVal });
        }
    });

    return changes;
}
