// @ts-nocheck
import { isEmpty } from 'lodash';
import * as R from 'ramda';
import { AnchorButton, Button, Intent, Tag, Text } from '@blueprintjs/core';
import { AppToaster, Box, FormatNumber, Group, Stack } from '@/components';
import {
  MatchingTransactionBoot,
  useMatchingTransactionBoot,
} from './MatchingTransactionBoot';
import { MatchTransaction, MatchTransactionProps } from './MatchTransaction';
import styles from './CategorizeTransactionAside.module.scss';
import { FastField, FastFieldProps, Form, Formik } from 'formik';
import { useMatchUncategorizedTransaction } from '@/hooks/query/bank-rules';
import { MatchingTransactionFormValues } from './types';
import { transformToReq, useGetPendingAmountMatched } from './utils';
import { useCategorizeTransactionTabsBoot } from './CategorizeTransactionTabsBoot';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../withBankingActions';

const initialValues = {
  matched: {},
};

export function MatchingBankTransaction() {
  const { uncategorizedTransactionId } = useCategorizeTransactionTabsBoot();
  const { mutateAsync: matchTransaction } = useMatchUncategorizedTransaction();

  // Handles the form submitting.
  const handleSubmit = (values: MatchingTransactionFormValues) => {
    const _values = transformToReq(values);

    if (_values.matchedTransactions?.length === 0) {
      AppToaster.show({
        message: 'You should select at least one transaction for matching.',
        intent: Intent.DANGER,
      });
      return;
    }
    matchTransaction({ id: uncategorizedTransactionId, values: _values })
      .then(() => {
        AppToaster.show({
          intent: Intent.SUCCESS,
          message: 'The bank transaction has been matched successfully.',
        });
      })
      .catch((err) => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  };

  return (
    <MatchingTransactionBoot
      uncategorizedTransactionId={uncategorizedTransactionId}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          <MatchingBankTransactionContent />
        </Form>
      </Formik>
    </MatchingTransactionBoot>
  );
}

function MatchingBankTransactionContent() {
  return (
    <Box className={styles.root}>
      <PerfectMatchingTransactions />
      <GoodMatchingTransactions />
      <MatchTransactionFooter />
    </Box>
  );
}

/**
 * Renders the perfect match transactions.
 * @returns {React.ReactNode}
 */
function PerfectMatchingTransactions() {
  const { perfectMatches, perfectMatchesCount } = useMatchingTransactionBoot();

  // Can't continue if the perfect matches is empty.
  if (isEmpty(perfectMatches)) {
    return null;
  }
  return (
    <>
      <Box className={styles.matchBar}>
        <Group spacing={6}>
          <h2 className={styles.matchBarTitle}>Perfect Matchines</h2>
          <Tag minimal round intent={Intent.SUCCESS}>
            {perfectMatchesCount}
          </Tag>
        </Group>
      </Box>

      <Stack spacing={9} style={{ padding: '12px 15px' }}>
        {perfectMatches.map((match, index) => (
          <MatchTransactionField
            key={index}
            label={`${match.transsactionTypeFormatted} for ${match.amountFormatted}`}
            date={match.dateFormatted}
            transactionId={match.transactionId}
            transactionType={match.transactionType}
          />
        ))}
      </Stack>
    </>
  );
}

/**
 * Renders the possible match transactions.
 * @returns {React.ReactNode}
 */
function GoodMatchingTransactions() {
  const { possibleMatches } = useMatchingTransactionBoot();

  // Can't continue if the possible matches is emoty.
  if (isEmpty(possibleMatches)) {
    return null;
  }
  return (
    <>
      <Box className={styles.matchBar}>
        <Stack spacing={2}>
          <h2 className={styles.matchBarTitle}>Possible Matches</h2>
          <Text style={{ fontSize: 12, color: '#5C7080' }}>
            Transactions up to 20 Aug 2019
          </Text>
        </Stack>
      </Box>

      <Stack spacing={9} style={{ padding: '12px 15px' }}>
        {possibleMatches.map((match, index) => (
          <MatchTransactionField
            key={index}
            label={`${match.transsactionTypeFormatted} for ${match.amountFormatted}`}
            date={match.dateFormatted}
            transactionId={match.transactionId}
            transactionType={match.transactionType}
          />
        ))}
      </Stack>
    </>
  );
}
interface MatchTransactionFieldProps
  extends Omit<MatchTransactionProps, 'onChange' | 'active' | 'initialActive'> {
  transactionId: number;
  transactionType: string;
}

function MatchTransactionField({
  transactionId,
  transactionType,
  ...props
}: MatchTransactionFieldProps) {
  const name = `matched.${transactionType}-${transactionId}`;

  return (
    <FastField name={name}>
      {({ form, field: { value } }: FastFieldProps) => (
        <MatchTransaction
          {...props}
          active={!!value}
          onChange={(state) => {
            form.setFieldValue(name, state);
          }}
        />
      )}
    </FastField>
  );
}

export function CategorizeBankTransactionContent() {
  return <h1>Categorizing</h1>;
}

interface MatchTransctionFooterProps extends WithBankingActionsProps {}

/**
 * Renders the match transactions footer.
 * @returns {React.ReactNode}
 */
const MatchTransactionFooter = R.compose(withBankingActions)(
  ({ closeMatchingTransactionAside }: MatchTransctionFooterProps) => {
    const handleCancelBtnClick = () => {
      closeMatchingTransactionAside();
    };
    const totalPending = useGetPendingAmountMatched();

    return (
      <Box className={styles.footer}>
        <Box className={styles.footerTotal}>
          <Group position={'apart'}>
            <AnchorButton small minimal intent={Intent.PRIMARY}>
              Add Reconcile Transaction +
            </AnchorButton>

            <Text style={{ fontSize: 13 }} tagName="span">
              Pending <FormatNumber value={totalPending} currency={'USD'} />
            </Text>
          </Group>
        </Box>

        <Box className={styles.footerActions}>
          <Group spacing={10}>
            <Button
              intent={Intent.PRIMARY}
              style={{ minWidth: 85 }}
              type="submit"
            >
              Match
            </Button>

            <Button onClick={handleCancelBtnClick}>Cancel</Button>
          </Group>
        </Box>
      </Box>
    );
  },
);

MatchTransactionFooter.displayName = 'MatchTransactionFooter';
