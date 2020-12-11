export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer'
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Categories',
        route: '/categories',
        icon: 'cil-cursor',
        items: [
          {
            name: 'All Category',
            to: '/categories'
          },
          {
            name: 'New Categories',
            to: '/categories/create'
          }
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Products',
        route: '/products',
        icon: 'cil-puzzle',
        items: [
          {
            name: 'All Product',
            to: '/products'
          },
          {
            name: 'New Product',
            to: '/products/create'
          }
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Orders',
        route: '/orders',
        icon: 'cil-puzzle',
        items: [
          {
            name: 'All Order',
            to: '/orders'
          }
        ]
      },
    ]
  }
]