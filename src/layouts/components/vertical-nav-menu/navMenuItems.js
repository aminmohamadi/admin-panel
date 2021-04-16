export default [
  {
    url: null,
    name: 'داشبورد',
    tagColor: 'warning',
    icon: 'HomeIcon',
    // i18n: "Dashboard",
    submenu: [
      {
        url: '/dashboard/analytics',
        name: 'آمار پنل',
        slug: 'dashboard-analytics'
        // i18n: "Analytics",
      },
      {
        url: '/dashboard/ecommerce',
        name: 'آمار فروشگاه',
        slug: 'dashboard-ecommerce'
        // i18n: "eCommerce",
      }
    ]
  },
  {
    url: null,
    name: 'مدیریت کاربران',
    icon: 'UserIcon',
    submenu: [
      {
        url: '/admins',
        name: 'مدیرها',
        slug: 'مدیرها',
        icon: 'User'
      },
      {
        url: '/users',
        name: 'کاربران',
        slug: 'کاربران',
        icon: 'User'
      },
      {
        url: '/roles',
        name: 'نقش ها',
        slug: 'نقش ها',
        icon: 'Role'
      },
      {
        url: '/functionality',
        name: 'عملکرد ها',
        slug: 'عملکرد ها',
        icon: 'Functionality'
      }

    ]
  },
  {
    url: null,
    name: 'مدیریت محصولات',
    icon: 'BriefcaseIcon',
    submenu: [
      {
        url: '/products',
        name: 'محصولات',
        slug: 'محصولات',
      },
      {
        url: '/courses',
        name: 'دوره ها',
        slug: 'دوره ها',
      },
      {
        url: '/categories',
        name: 'دسته بندی ها',
        slug: 'دسته بندی ها',
      },

      {
        url: '/category/attributegroup',
        name: 'گروه ویژگی ها',
        slug: 'گروه ویژگی ها',
      },
      {
        url: '/brands',
        name: 'برندها',
        slug: 'برندها',
      },
      {
        url: '/discount',
        name: 'تخفیف ها',
        slug: 'تخفیف ها',
      }


    ]
  },
  {
    url: null,
    name: 'مدیریت محتوا',
    icon: 'BookIcon',
    submenu: [
      {
        url: '/posts',
        name: 'پست ها',
        slug: 'پست ها',
      },
      {
        url: '/comments',
        name: 'نظرات',
        slug: 'نظرات',
      }


    ]
  }
]

