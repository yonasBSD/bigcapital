import React, { useEffect } from 'react';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import ProfitLossSheetHeaderGeneralPane from './ProfitLossSheetHeaderGeneralPane';

import withProfitLoss from './withProfitLoss';
import withProfitLossActions from './withProfitLossActions';

import { compose } from 'utils';

function ProfitLossHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withProfitLoss
  profitLossDrawerFilter,

  // #withProfitLossActions
  toggleProfitLossFilterDrawer: toggleFilterDrawer,
}) {
  // Validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
    filterByOption: Yup.string(),
    displayColumnsType: Yup.string(),
  });

  // Initial values.
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

  // Handle form submit.
  const handleSubmit = (values, actions) => {
    onSubmitFilter(values);
    toggleFilterDrawer(false);
  };

  // Handles the cancel button click.
  const handleCancelClick = () => {
    toggleFilterDrawer(false);
  };
  // Handles the drawer close action.
  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  return (
    <FinancialStatementHeader
      isOpen={profitLossDrawerFilter}
      drawerProps={{ onClose: handleDrawerClose }}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id="general"
              title={<T id={'general'} />}
              panel={<ProfitLossSheetHeaderGeneralPane />}
            />
          </Tabs>

          <div class="financial-header-drawer__footer">
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleCancelClick} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </FinancialStatementHeader>
  );
}

export default compose(
  withProfitLoss(({ profitLossDrawerFilter }) => ({
    profitLossDrawerFilter,
  })),
  withProfitLossActions,
)(ProfitLossHeader);