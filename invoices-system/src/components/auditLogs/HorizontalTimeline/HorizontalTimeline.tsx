'use client';

import React, { useState } from 'react';
import { AuditLog } from '../../../types/typesInvoice';
import ArrowRight from './ArrowRight';
import DetailedPanel from './DetailedPanel';
import TimelineCircle from './TimelineCircle';
import TimelineLogItem from './TimelineLogItem';

interface HorizontalTimelineProps {

    logs: AuditLog[];
}

export default function HorizontalTimeline({ logs }: HorizontalTimelineProps) {

    const sorted = [...logs].sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());

    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    return (

        <div>
            <div className="flex items-center justify-center space-x-8 overflow-x-auto">

                <TimelineCircle label="Start" />
                <ArrowRight />

                {sorted.map((log, idx) => (<React.Fragment key={log.id}> <TimelineLogItem log={log} onSelect={setSelectedLog} /> {idx < sorted.length - 1 && <ArrowRight />} </React.Fragment>))}

                <ArrowRight />
                <TimelineCircle label="End" />

            </div>

            {selectedLog && (<DetailedPanel log={selectedLog} onClose={() => setSelectedLog(null)} />)}

        </div>
    );
}
