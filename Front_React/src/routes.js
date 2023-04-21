import React from 'react';

const User = React.lazy(() => import('./views/ShowUser'));
const ModifyUser = React.lazy(() => import('./views/ModifyUserForm'));
const NewUser = React.lazy(() => import('./components/NewUser'));
const ShowAllUsers = React.lazy(() => import('./views/ShowAllUsers'));

const Ticket = React.lazy(() => import('./views/ShowTicket'));
const ModifyTicket = React.lazy(() => import('./views/ModifyTicketForm'));
const NewTicket = React.lazy(() => import('./components/NewTicket'));
const ShowAllTickets = React.lazy(() => import('./views/ShowAllTickets'));

const Company = React.lazy(() => import('./views/ShowCompany'));
const ModifyCompany = React.lazy(() => import('./views/ModifyCompanyForm'));
const NewCompany = React.lazy(() => import('./components/NewCompany'));
const ListCompanies = React.lazy(() => import('./views/ShowAllCompanies'));

const Login = React.lazy(() => import('./components/Login'));
const PasswordForgotten = React.lazy(() => import('./components/PasswordForgotten'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));
const Page404= React.lazy(() => import('./components/Page404'));
const Page500 = React.lazy(() => import('./components/Page500'));

const Dashboard = React.lazy(() => import('./views/AdminDashboard'));
const UserDashboard = React.lazy(() => import('./views/UserDashboard'));
const CompanyPdf = React.lazy(() => import('./views/CompanyPdf'));

const routes = [
  { path: '/profil/:userId', exact : true, name: 'Profil', component: User },
  { path: '/modify-user/:userId', exact : true, name: 'ModifyUser', component: ModifyUser },
  { path: '/create-user', exact : true, name: 'CreateUser', component: NewUser },
  { path: '/list-users/:entreprise', exact : true, name: 'ShowAllUsers', component: ShowAllUsers },
  { path: '/ticket/:ticketId', exact : true, name: 'Ticket', component: Ticket},
  { path: '/modify-ticket/:ticketId', exact : true, name: 'ModifyTicket', component: ModifyTicket },
  { path: '/new-ticket', exact : true, name: 'NewTicket', component: NewTicket },
  { path: '/list-tickets/:entreprise/:user/:step', exact : true, name: 'ShowAllTickets', component: ShowAllTickets },
  { path: '/company/:companyId', exact : true, name: 'Company', component: Company},
  { path: '/modify-company/:companyId', exact : true, name: 'ModifyCompany', component: ModifyCompany },
  { path: '/new-company', exact : true, name: 'NewCompany', component: NewCompany },
  { path: '/list-companies', exact : true, name: 'ListCompanies', component: ListCompanies },
  { path: '/login', exact : true, name: 'Login', component: Login },
  { path: '/password-forgotten', exact : true, name: 'PasswordForgotten', component: PasswordForgotten },
  { path: '/reset-password', exact : true, name: 'ResetPassword', component: ResetPassword },
  { path: '/page404', name: 'Page404', component: Page404 }, // ??
  { path: '/page500', name: 'Page500', component: Page500 }, // ??
  { path: '/admin-dashboard', exact : true, name: 'AdminDashboard', component: Dashboard },
  { path: '/user-dashboard', exact : true, name: 'UserDashboard', component: UserDashboard },
  { path: '/pdf/:companyId', exact : true, name: 'CompanyPdf', component: CompanyPdf }
];

export default routes;