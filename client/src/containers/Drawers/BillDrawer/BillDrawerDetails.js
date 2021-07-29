import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import LocatedLandedCostTable from './LocatedLandedCostTable';
import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';

/**
 * Bill view details.
 */
export default function BillDrawerDetails() {
  return (
    <div className="view-detail-drawer">
      <Tabs animate={true} large={true} defaultSelectedTabId="landed_cost">
        <Tab title={intl.get('details')} id={'details'} disabled={true} />
        <Tab
          title={intl.get('journal_entries')}
          id={'journal_entries'}
          panel={<JournalEntriesTable />}
        />
        <Tab
          title={intl.get('located_landed_cost')}
          id={'landed_cost'}
          panel={<LocatedLandedCostTable />}
        />
      </Tabs>
    </div>
  );
}
