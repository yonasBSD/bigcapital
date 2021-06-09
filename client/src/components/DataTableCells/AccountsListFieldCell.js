import React, { useRef, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useCellAutoFocus } from 'hooks';
import { formatMessage } from 'services/intl';

import AccountsSuggestField from 'components/AccountsSuggestField';

// import AccountsSelectList from 'components/AccountsSelectList';
import { FormGroup, Classes, Intent } from '@blueprintjs/core';

/**
 * Account cell renderer.
 */
export default function AccountCellRenderer({
  column: {
    id,
    accountsDataProp,
    filterAccountsByRootTypes,
    filterAccountsByTypes,
  },
  row: { index, original },
  cell: { value: initialValue },
  payload: {
    accounts: defaultAccounts,
    updateData,
    errors,
    autoFocus,
    ...restPayloadProps
  },
}) {
  const accountRef = useRef();

  useCellAutoFocus(accountRef, autoFocus, id, index);

  const handleAccountSelected = useCallback(
    (account) => {
      updateData(index, id, account.id);
    },
    [updateData, index, id],
  );
  const error = errors?.[index]?.[id];

  const accounts = useMemo(
    () => restPayloadProps[accountsDataProp] || defaultAccounts,
    [restPayloadProps, defaultAccounts, accountsDataProp],
  );

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(
        'form-group--select-list',
        'form-group--account',
        Classes.FILL,
      )}
    >
      <AccountsSuggestField
        accounts={accounts}
        onAccountSelected={handleAccountSelected}
        selectedAccountId={initialValue}
        filterByRootTypes={filterAccountsByRootTypes}
        filterByTypes={filterAccountsByTypes}
        inputProps={{
          inputRef: (ref) => (accountRef.current = ref),
          placeholder: formatMessage({ id: 'search' }),
        }}
        openOnKeyDown={true}
        blurOnSelectClose={false}
      />
    </FormGroup>
  );
}
