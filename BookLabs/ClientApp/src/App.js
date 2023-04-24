
import './App.css';
import { Routes, Route } from "react-router-dom";
import RequireAuth from './components/RequireAuth';
import Login from "./components/Login";
import Register from "./components/Register";
import Unauthorized from "./components/Unauthorized";

import UserAuthors from "./components/nonAdmins/UserAuthors";
import UserBooks from "./components/nonAdmins/UserBooks";
import UserDashboard from "./components/nonAdmins/UserDashboard";

import Books from "./components/admins/Books";
import Dashboard from "./components/admins/Dashboard";
import Authors from "./components/admins/Authors";
import Users from "./components/admins/Users";
import Layout from './components/Layout';

const ROLES = {
  'admin': 'admin',
  'user': 'user'
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="Register" element={<Register />} />
        <Route path="Login" exact element={<Login />} />        
        <Route path="Unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth allowedRoles={ROLES.admin} />}>
          <Route path="Authors" element={<Authors />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Books" element={<Books />} />
          <Route path="Users" element={<Users />} />
        </Route>
        
        <Route element={<RequireAuth allowedRoles={ROLES.user} />}>
          <Route path="UserAuthors" element={<UserAuthors />} />
          <Route path="UserBooks" element={<UserBooks />} />
          <Route path="/" element={<UserDashboard />} />
          <Route path="UserDashboard" element={<UserDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
