export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/admin-dashboard'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Profil',
    to: '/profil/2'
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Tickets',
    route: '/base',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Liste des tickets',
        to: '/list-tickets/all/all/all',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Créer un ticket',
        to: '/new-ticket',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Utilisateurs',
    route: '/base',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Liste des utilisateurs',
        to: '/list-users/all',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Créer un utilisateur',
        to: '/create-user',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Entreprises',
    route: '/base',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Voir les entreprises',
        to: '/list-companies',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Créer une entreprise',
        to: '/new-company',
      }
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Se déconnecter',
    to: '/',
  }
]


