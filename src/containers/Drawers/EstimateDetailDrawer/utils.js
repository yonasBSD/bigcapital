import React from 'react';
import intl from 'react-intl-universal';
import { FormatNumberCell } from '../../../components';

/**
 * Retrieve table columns of estimate readonly entries details.
 */
export const useEstimateReadonlyEntriesColumns = () =>
  React.useMemo(() => [
    {
      Header: intl.get('product_and_service'),
      accessor: 'item.name',
      width: 150,
      className: 'name',
      disableSortBy: true,
    },
    {
      Header: intl.get('description'),
      accessor: 'description',
      className: 'description',
      disableSortBy: true,
    },
    {
      Header: intl.get('quantity'),
      accessor: 'quantity',
      Cell: FormatNumberCell,
      width: 100,
      align: 'right',
      disableSortBy: true,
    },
    {
      Header: intl.get('rate'),
      accessor: 'rate',
      Cell: FormatNumberCell,
      width: 100,
      align: 'right',
      disableSortBy: true,
    },
    {
      Header: intl.get('amount'),
      accessor: 'amount',
      Cell: FormatNumberCell,
      width: 100,
      align: 'right',
      disableSortBy: true,
    },
  ], []);