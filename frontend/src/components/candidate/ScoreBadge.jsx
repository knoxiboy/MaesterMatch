import React from 'react';
import { cn } from '../../lib/utils';

const ScoreBadge = ({ score }) => {
    let statusClass = '';
    let label = '';

    if (score > 70) {
        statusClass = 'status-badge-green';
        label = 'Strong';
    } else if (score > 49) {
        statusClass = 'status-badge-yellow';
        label = 'Good';
    } else {
        statusClass = 'status-badge-red';
        label = 'Weak';
    }

    return (
        <div className={cn(statusClass, "w-fit")}>
            {label}
        </div>
    );
};

export default ScoreBadge;
