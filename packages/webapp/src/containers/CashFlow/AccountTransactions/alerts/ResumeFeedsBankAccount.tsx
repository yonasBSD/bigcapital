// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from '@/components';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { useResumeFeedsBankAccount } from '@/hooks/query/bank-accounts';
import { compose } from '@/utils';

/**
 *
 */
function ResumeFeedsBankAccountAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { bankAccountId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: resumeFeedsBankAccount, isLoading } =
    useResumeFeedsBankAccount();

  // Handle activate item alert cancel.
  const handleCancelActivateItem = () => {
    closeAlert(name);
  };

  // Handle confirm item activated.
  const handleConfirmItemActivate = () => {
    resumeFeedsBankAccount(bankAccountId)
      .then(() => {
        AppToaster.show({
          message: 'The bank feeds of the bank account has been resumed.',
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'activate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelActivateItem}
      loading={isLoading}
      onConfirm={handleConfirmItemActivate}
    >
      <p>Are you sure.</p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ResumeFeedsBankAccountAlert);
