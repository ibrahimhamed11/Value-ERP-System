import { Route, Routes } from 'react-router-dom';
import { List } from '../Roles/Components/List'
import { ListUser } from '../User/Components/List'
import { Role } from '../Roles/Components/Role'
import {User} from '../User/Components/User'
const RolesCRUD = () => {
    return (
        <Routes>
            <Route path="add" element={<Role />} />
            <Route path="edit/:id" element={<Role />} />
            <Route index path="/:id" element={<Role />} />
            <Route path="/" element={<List />} />
        </Routes>
    );
};
const UserCRUD = () => {
    return (
        <Routes>
            <Route path="add" element={<User />} />
            <Route path="edit/:id" element={<User />} />
            <Route index path="/:id" element={<User />} />
            <Route path="/" element={<ListUser />} />
        </Routes>
    );
};



export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/role/*" element={<RolesCRUD />} />
            <Route path="/user/*" element={<UserCRUD />} />
        </Routes>
    );
};