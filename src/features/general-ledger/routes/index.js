import { Route, Routes } from 'react-router-dom';

import { GeneralConsolidatedChart } from '../pages/GeneralConsolidatedChart';


import { Reports } from '../pages/Reports';
import { Project } from '../pages/Project';
import { Default } from '../pages/GeneralLedgerDefault';
import { PrePayment } from '../pages/PrePayment';
import { AccountsDetails } from '../pages/AccountsDetails';
import { List as ListGLAccount } from '../components/GLAccount';
import { GLAccount } from '../components/GLAccount/GLAccount';
import { List as ListCostCenter } from '../components/CostCenter';
import { CostCenter } from '../components/CostCenter/CostCenter';

import {
  Add as AddJournal,
  List as ListJournal,
  Edit as EditJournal,
  View as JournalView
} from '../components/Journal';

import { Journal } from '../components/Journal/Jouranl';



import {
  List as ListCategory,
} from '../components/CostCenterCategory';

import { CostCenterCategoty } from '../components/CostCenterCategory/CostCenterCategory';





const GLAccountCRUD = () => {
  return (
    <Routes>
      <Route path="add" element={<GLAccount />} />
      <Route path="edit/:id" element={<GLAccount />} />
      <Route index path="/:id" element={<GLAccount />} />
      <Route path="/" element={<ListGLAccount />} />
    </Routes>
  );
};


const CostCenterCRUD = () => {
  return (
    <Routes>
      <Route path="add" element={<CostCenter />} />
      <Route path="edit/:id" element={<CostCenter />} />
      <Route index path="/:id" element={<CostCenter />} />
      <Route path="/" element={<ListCostCenter />} />
    </Routes>
  );
};

 

const JournalCRUD = () => {
  return (
    <Routes>
      <Route path="add" element={<Journal />} />
      <Route path="edit/:id" element={<Journal />} />
      <Route index path="view/:id" element={<Journal />} />
      <Route path="/" element={<ListJournal />} />
    </Routes>
  );
};





const CostCenterCategoryCRUD = () => {
  return (
    <Routes>
      <Route path="add" element={<CostCenterCategoty />} />
      <Route path="edit/:id" element={<CostCenterCategoty />} />
      <Route index path="/:id" element={<CostCenterCategoty />} />
      <Route path="/" element={<ListCategory />} />
    </Routes>
  );
};






const GeneralLedgerMasterFilesRoutes = () => {
  return (
    <Routes>
      <Route path="consolidated-chart" element={<GeneralConsolidatedChart />} />
      <Route path="GL-Account/*" element={<GLAccountCRUD />} />
      <Route path="costCenter/*" element={<CostCenterCRUD />} />
      <Route path="CostCenterCategory/*" element={<CostCenterCategoryCRUD />} />

      
      <Route path="project" element={<Project />} />

    </Routes>
  );
};
const GeneralLedgerTransactionsRoutes = () => {
  return (
    <Routes>
      <Route path="journal/*" element={<JournalCRUD />} />
      <Route path="pre-payment-and-accrual-entry" element={<PrePayment />} />
    </Routes>
  );
};
const QueriesRoutes = () => {
  return (
    <Routes>
      <Route path="accounts-details-queries" element={<AccountsDetails />} />
    </Routes>
  );
};

export const GLRoutes = () => {
  return (
    <Routes>

      <Route path="/" index element={<Default />} />
      <Route path="/master-files/*" element={<GeneralLedgerMasterFilesRoutes />} />
      <Route path="/transactions/*" element={<GeneralLedgerTransactionsRoutes />} />
      <Route path="/queries/*" element={<QueriesRoutes />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
};
