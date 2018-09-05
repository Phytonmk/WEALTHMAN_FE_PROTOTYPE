const questions = {
  investor: [
    {
      property: 'name',
      title: 'Name',
      obvious: true
    },
    {
      property: 'surname',
      title: 'Last name'
    },
    {
      property: 'age',
      title: 'Age',
      type: 'number'
    },
    {
      property: 'phone_number',
      title: 'Phone number',
      placeholder: 'x (xxx) xxx-xx-xx'
    },
    {
      property: 'country',
      title: 'Country'
    },
    {
      property: 'address',
      title: 'Address'
    },
    {
      property: 'img',
      type: 'photo_upload',
      uploadFor: 'investor'
    },
    {
      property: 'wallet_address',
      title: 'Wallet address',
      type: 'wallet_address',
      obvious: true
    }
  ],
  manager: [
    {
      property: 'name',
      title: 'Name',
      obvious: true
    },
    {
      property: 'surname',
      title: 'Last name'
    },
    {
      property: 'tweeter',
      title: 'Tweeter'
    },
    {
      property: 'fb',
      title: 'Facebook'
    },
    {
      property: 'linkedin',
      title: 'Linkedin'
    },
    {
      property: 'about',
      title: 'About',
      type: 'textarea'
    },
    {
      property: 'services',
      title: 'Services',
      type: 'services',
      obvious: true
    },
    {
      property: 'img',
      type: 'photo_upload',
      uploadFor: 'manager'
    },
    {
      property: 'wallet_address',
      title: 'Wallet address',
      type: 'wallet_address',
      obvious: true
    }
  ],
  managerShort: [
    {
      property: 'name',
      title: 'Name',
      obvious: true
    },
    {
      property: 'surname',
      title: 'Last name'
    }],
  company: [
    {
      property: 'company_name',
      title: 'Company name',
      obvious: true
    },
    {
      property: 'company_link',
      title: 'Company website'
    },
    {
      property: 'founded',
      title: 'Founded',
      type: 'number'
    },
    {
      property: 'company_size',
      title: 'Company size'
    },
    {
      property: 'headqueartet',
      title: 'Headquarter'
    },
    {
      property: 'tweeter',
      title: 'Tweeter'
    },
    {
      property: 'fb',
      title: 'Facebook'
    },
    {
      property: 'linkedin',
      title: 'Linkedin'
    },
    {
      property: 'about',
      title: 'About',
      type: 'textarea'
    },
    {
      property: 'services',
      title: 'Services',
      type: 'services',
      obvious: true
    },
    {
      property: 'img',
      type: 'photo_upload',
      uploadFor: 'company'
    },
    {
      property: 'wallet_address',
      title: 'Wallet address',
      type: 'wallet_address',
      obvious: true
    }
  ],
  companyShort: [
    {
      property: 'company_name',
      title: 'Company name',
      obvious: true
    }
  ]
}

export default questions;