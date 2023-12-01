import { Route, Routes } from 'react-router-dom';

import {
  List as ListCompany,
} from '../components/Company';

import {Company} from '../components/Company/Company'


import {
  Add as AddBranch,
  List as ListBranch,
  Edit as EditBranch,
  View as ViewBranch
} from '../components/Branch';

import {Branch} from '../components/Branch/Branch'


const CompanyCRUD = () => {
  return (
    <Routes>
      <Route path="/" element={<ListCompany />} />
      <Route path="add" element={<Company />} />
      <Route path="edit/:id" element={<Company />} />
      <Route path="/:id" element={<Company />} />
    </Routes>
  );
};

const BranchCRUD = () => {
  return (
    <Routes>
      {/* <Route index path="/:id" element={<ViewBranch />} /> */}
      <Route index path="/:id" element={<Branch />} />
      {/* <Route path="add" element={<AddBranch />} /> */}
      <Route path="add" element={<Branch />} />
      {/* <Route path="edit/:id" element={<EditBranch />} /> */}
      <Route path="edit/:id" element={<Branch />} />
      <Route path="/" element={<ListBranch />} />
    </Routes>
  );
};

export const OrganizationRoutes = () => {
  return (
    <Routes>
      <Route path="company/*" element={<CompanyCRUD />} />
      <Route path="branch/*" element={<BranchCRUD />} />
    </Routes>
  );
};
