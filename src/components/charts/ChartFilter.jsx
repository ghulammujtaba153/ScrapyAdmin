import React from 'react';
import { Segmented } from 'antd';

const ChartFilter = ({ activeFilter, onFilterChange }) => (
    <Segmented
        value={activeFilter}
        onChange={onFilterChange}
        options={[
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Yearly', value: 'yearly' },
        ]}
    />
);

export default ChartFilter;
