import { CategoryType, SubCategoryType } from "./types"

const imageBaseUrl = "https://bookmei-bucket.s3.ap-south-1.amazonaws.com/frontend/common/"

// side bar icons
export const homeIcon = imageBaseUrl + "home_icon.png"
export const serviceIcon = imageBaseUrl + "service_icon.png"
export const teamIcon = imageBaseUrl + "team_icon.png"
export const calendarIcon = imageBaseUrl + "calendar_icon.png"
export const precentageIcon = imageBaseUrl + "precentage_icon.png"

// header icons
export const notificationIcon = imageBaseUrl + "notification_icon.png"
export const profileIcon = imageBaseUrl + "profile_icon.png"

// common icons
export const searchIcon = "https://img.icons8.com/ios-glyphs/30/search.png"
export const editIcon = "https://img.icons8.com/ios-filled/50/edit--v1.png"
export const deleteIcon = "https://img.icons8.com/ios-glyphs/30/trash--v1.png"
export const closeIcon = "https://img.icons8.com/ios-filled/50/delete-sign--v1.png"
export const leftArrowIcon = "https://img.icons8.com/ios-filled/50/long-arrow-left.png"
export const rightArrowIcon = "https://img.icons8.com/ios-filled/50/long-arrow-right.png"
export const arrowBackIcon = "https://img.icons8.com/ios-filled/50/back.png"
export const arrowForwardIcon = "https://img.icons8.com/ios-filled/50/forward--v1.png"
export const sendIcon = "https://img.icons8.com/ios-filled/50/sent.png"
export const checkIcon = "https://img.icons8.com/material-sharp/24/checkmark--v1.png"
export const loaderIcon = imageBaseUrl + "loader_icon.png"
export const userIcon = "https://img.icons8.com/ios-filled/50/user.png"
export const starIcon = "https://img.icons8.com/material-sharp/24/star--v1.png"
export const calenderEventIcon = "https://img.icons8.com/external-kmg-design-glyph-kmg-design/32/external-calendar-sales-kmg-design-glyph-kmg-design.png"
export const carrotUpIcon = "https://img.icons8.com/ios-filled/50/000000/chevron-up.png"
export const carrotDownIcon = "https://img.icons8.com/ios-filled/50/000000/chevron-down.png"
export const chevronDownIcon = "https://img.icons8.com/ios/50/chevron-down.png"
export const chevronUpIcon = "https://img.icons8.com/ios/50/chevron-up.png"
export const infoIcon = "https://img.icons8.com/ios-filled/50/info.png"
export const threeDots = "https://img.icons8.com/fluency-systems-filled/50/ellipsis.png"
export const clearIcon = "https://img.icons8.com/ios-glyphs/30/broom.png"
export const timeIcon = "https://img.icons8.com/dotty/50/time.png"
export const availableIcon = "https://img.icons8.com/external-glyph-geotatah/64/external-available-risk-management-glyph-glyph-geotatah.png"
export const emailIcon = "https://img.icons8.com/pastel-glyph/50/new-post.png"
export const phoneIcon = "https://img.icons8.com/fluency-systems-filled/50/smartphone--v2.png"
export const draftIcon = "https://img.icons8.com/pastel-glyph/50/edit-file--v2.png"
export const hourGlassIcon = "https://img.icons8.com/ios-filled/50/hourglass.png"
export const storeIcon = "https://img.icons8.com/pastel-glyph/50/shop--v1.png" 
export const signOutIcon = "https://img.icons8.com/ios-filled/50/exit.png" 
export const restartIcon = "https://img.icons8.com/ios/50/restart--v1.png" 
export const lockIcon = "https://img.icons8.com/ios-filled/50/password.png" 
export const mapMarkerIcon = "https://img.icons8.com/glyph-neue/50/marker.png" 
export const userLineIcon = "https://img.icons8.com/ios/50/user.png" 
export const settingsIcon = "https://img.icons8.com/ios-filled/50/settings.png" 
export const adminIcon = "https://img.icons8.com/ios-glyphs/30/administrator-male.png" 
export const menuIcon = "https://img.icons8.com/ios-filled/50/menu--v1.png" 
export const promotionIcon = "https://img.icons8.com/ios-filled/50/commercial.png" 
export const filterIcon = "https://img.icons8.com/ios-glyphs/30/filter.png" 
export const viewIcon = "https://img.icons8.com/ios-filled/50/external-link.png" 
export const createCampaignIcon = "https://img.icons8.com/dotty/50/create-new.png" 
export const campaignIcon = "https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/50/external-ads-digital-marketing-tanah-basah-basic-outline-tanah-basah.png" 
export const automaticIcon = "https://img.icons8.com/carbon-copy/100/automatic.png" 
export const themeIcon = "https://img.icons8.com/dotty/50/color-palette.png"


export const categories: CategoryType[] = [
    {
      id: 1,
      name: 'Beauty & Wellness',
      translation: 'Beauty & Wellness',
      largeImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/large_beauty.webp",
      smallImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/small_beauty.webp",
      url: 'beauty-and-wellness',
      isAvailable: true,
      lineImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/black_line/beauty_and_wellness.png",
    },
    {
      id: 2,
      name: 'Events & Spaces',
      translation: 'Events & Spaces',
      largeImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/large_hospitality.webp",
      smallImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/small_hospitality.webp",
      url: 'events-and-spaces',
      isAvailable: false,
      lineImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/black_line/events_and_spaces.png",
    },
    {
      id: 3,
      name: 'Health & Medical',
      translation: 'Health & Medical',
      largeImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/large_massage.webp",
      smallImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/small_massage.webp",
      url: 'health-and-medical',
      isAvailable: false,
      lineImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"main_categories/black_line/health_and_medical.png",
    },
    {
      id: 4,
      name: 'Education & Experts',
      translation: 'Education & Experts',
      largeImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/large_education.webp",
      smallImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/small_education.webp",
      url: 'education-and-experts',
      isAvailable: false,
      lineImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"main_categories/black_line/education_and_experts.png",
    },
    {
      id: 5,
      name: 'Home & Workplace',
      translation: 'Home & Workplace',
      largeImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/large_home_services.webp",
      smallImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/small_home_services.webp",
      url: 'home-and-workplace',
      isAvailable: false,
      lineImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"main_categories/black_line/home_and_workplace.png",
    },
    {
      id: 6,
      name: 'Fashion & Style',
      translation: 'Fashion & Style',
      largeImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/large_fashion.webp",
      smallImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/small_fashion.webp",
      url: 'fashion-and-style',
      isAvailable: false,
      lineImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"main_categories/black_line/fashion_and_style.png",
    },
    {
      id: 7,
      name: 'In-Demand Services',
      translation: 'In-Demand Services',
      largeImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/large_parttime.webp",
      smallImage: import.meta.env.VITE_PROVIDER_IMAGE_URL + "top-navbar-assets/small_parttime.webp",
      url: 'in-demand-services',
      isAvailable: false,
      lineImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"main_categories/black_line/indemand_services.png",
    },
    {
      id: 8,
      name: 'Travel & Stay',
      translation: 'Travel & Stay',
      largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/travel_and_stay.png",
      smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/travel_and_stay.png",
      url: 'travel-and-stay',
      isAvailable: false,
      lineImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"main_categories/black_line/travel_and_stay.png",
    }
  ]
  
  export const subCategories: SubCategoryType[] = [
    {
      id: 1,
      mainCategory: "Beauty & Wellness",
      subCategories: [
        {
          id: 1,
          name: 'Saloons',
          translation: 'Saloons',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/saloons.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/saloons.png",
          url: 'saloons',
          isAvailable: true,
          lineImage: 'main_categories/black_line/saloon.png',
        },
        {
          id: 2,
          name: 'Spa',
          translation: 'Spa',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/spa.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/spa.png",
          url: 'spa',
          isAvailable: true,
          lineImage: 'main_categories/black_line/spa.png',
        },
        {
          id: 3,
          name: 'Bridal Services',
          translation: 'Bridal Services',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/bridal_services.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/bridal_services.png", 
          url: 'bridal-services',
          isAvailable: true,
          lineImage: 'main_categories/black_line/bridal_services.png',
        },
        {
          id: 4,
          name: 'Therapy',
          translation: 'Therapy',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/therapy.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/therapy.png",
          url: 'therapy',
          isAvailable: true,
          lineImage: 'main_categories/black_line/therapy.png',
        },
        {
          id: 5,
          name: 'Cosmetics Services',
          translation: 'Cosmetics Services',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/cosmetic_services.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/cosmetic_services.png",
          url: 'cosmetics-services',
          isAvailable: true,
          lineImage: 'main_categories/black_line/cosmetic_services.png',
        },
      ]
    },
    {
      id: 2,
      mainCategory: "Events & Spaces",
      subCategories: [
        {
          id: 1,
          name: 'Saloons',
          translation: 'Saloons',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/saloons.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/saloons.png",
          url: 'saloons',
          isAvailable: true,
          lineImage: 'main_categories/black_line/saloon.png',
        },
        {
          id: 2,
          name: 'Spa',
          translation: 'Spa',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/spa.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/spa.png",
          url: 'spa',
          isAvailable: true,
          lineImage: 'main_categories/black_line/spa.png',
        },
        {
          id: 3,
          name: 'Bridal Services',
          translation: 'Bridal Services',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/bridal_services.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/bridal_services.png", 
          url: 'bridal-services',
          isAvailable: true,
          lineImage: 'main_categories/black_line/bridal_services.png',
        },
        {
          id: 4,
          name: 'Therapy',
          translation: 'Therapy',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/therapy.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/therapy.png",
          url: 'therapy',
          isAvailable: true,
          lineImage: 'main_categories/black_line/therapy.png',
        },
        {
          id: 5,
          name: 'Cosmetics Services',
          translation: 'Cosmetics Services',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/cosmetic_services.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/cosmetic_services.png",
          url: 'cosmetics-services',
          isAvailable: true,
          lineImage: 'main_categories/black_line/cosmetic_services.png',
        },
      ]
    },
    {
      id: 3,
      mainCategory: "Health & Medical",
      subCategories: [
        {
          id: 1,
          name: 'Saloons',
          translation: 'Saloons',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/saloons.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/saloons.png",
          url: 'saloons',
          isAvailable: true,
          lineImage: 'main_categories/black_line/saloon.png',
        },
        {
          id: 2,
          name: 'Spa',
          translation: 'Spa',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/spa.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/spa.png",
          url: 'spa',
          isAvailable: true,
          lineImage: 'main_categories/black_line/spa.png',
        },
        {
          id: 3,
          name: 'Bridal Services',
          translation: 'Bridal Services',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/bridal_services.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/bridal_services.png", 
          url: 'bridal-services',
          isAvailable: true,
          lineImage: 'main_categories/black_line/bridal_services.png',
        },
        {
          id: 4,
          name: 'Therapy',
          translation: 'Therapy',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/therapy.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/therapy.png",
          url: 'therapy',
          isAvailable: true,
          lineImage: 'main_categories/black_line/therapy.png',
        },
        {
          id: 5,
          name: 'Cosmetics Services',
          translation: 'Cosmetics Services',
          largeImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/cosmetic_services.png",
          smallImage: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "main_categories/coloured/cosmetic_services.png",
          url: 'cosmetics-services',
          isAvailable: true,
          lineImage: 'main_categories/black_line/cosmetic_services.png',
        },
      ]
    }
  ]

// line arts
export const bookmeiMainServices = [
    {
        id: 1,
        name: 'beauty & wellness',
        image: 'main_categories/black_line/beauty_and_wellness.png',
        isAvailable: true
    },
    {
        id: 2,
        name: 'Event & Spaces',
        image: 'main_categories/black_line/events_and_spaces.png',
        isAvailable: false
    },
    {
        id: 3,
        name: 'Health & Medical',
        image: 'main_categories/black_line/health_and_medical.png',
        isAvailable: false
    },
    {
        id: 4,
        name: 'Education & Experts',
        image: 'main_categories/black_line/education_and_experts.png',
        isAvailable: false
    },
    {
        id: 5,
        name: 'Home & Workplace',
        image: 'main_categories/black_line/home_and_workplace.png',
        isAvailable: false
    },
    {
        id: 6,
        name: 'Fashion & Style',
        image: 'main_categories/black_line/fashion_and_style.png',
        isAvailable: false
    },
    {
        id: 7,
        name: 'In-Demand Services',
        image: 'main_categories/black_line/indemand_services.png',
        isAvailable: false
    },
    {
        id: 7,
        name: 'Travel & Stay',
        image: 'main_categories/black_line/travel_and_stay.png',
        isAvailable: false
    }

]

export const bookmeiBeautySearvices = [
    {
        id: 1,
        name: 'Salons',
        image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + 'main_categories/black_line/saloon.png',
        isAvailable: true
    },
    {
        id: 2,
        name: 'Spas',
        image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + 'main_categories/black_line/spa.png',
        isAvailable: true
    },
    {
        id: 3,
        name: 'Bridal Services',
        image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + 'main_categories/black_line/bridal_services.png',
        isAvailable: true
    },
    {
        id: 4,
        name: 'Fitness',
        image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + 'main_categories/black_line/fitness.png',
        isAvailable: true
    },
    {
        id: 5,
        name: 'Therapy',
        image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + 'main_categories/black_line/therapy.png',
        isAvailable: true
    },
    {
        id: 6,
        name: 'Cosmetics',
        image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + 'main_categories/black_line/cosmetic_services.png',
        isAvailable: true
    }
]

export const beautyServiceSubServices = [
    {
        id: 1,
        service: "Salons",
        sub_services: [
            { name: "Featured", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL + "black_line_package_types/Featured.png", isAvailable: true },
            { name: "Hair Care", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/1.+Hair+Care.png", isAvailable: true },
            { name: "Face Care", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/2.+Face+Care.png", isAvailable: true },
            { name: "Nail Care", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/3.+Nail+Care.png", isAvailable: true },
            { name: "Body Care", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Mask+group.png", isAvailable: true },
            { name: "Pedicure", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/5.+Pedicure.png", isAvailable: true },
            { name: "Manicure", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/6.Manicure.png", isAvailable: true },
            { name: "Other", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Other.png", isAvailable: true }
        ]
    },
    {
        id: 2,
        service: "Spas",
        sub_services: [
            { name: "Featured", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Featured.png", isAvailable: true  },
            { name: "Massages", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/1.+Facial+%26+hair+Treatments.png", isAvailable: true  },
            { name: "Body Treatments", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/2.+Body+Treatments.png", isAvailable: true  },
            { name: "Facial & Hair Treatments", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/3.+Facial+%26+hair+treatments.png", isAvailable: true  },
            { name: "Spa Treatments", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/4.+Spa+treatments.png", isAvailable: true  },
            { name: "Relaxation Services", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/5.+Relaxation+Services.png", isAvailable: true  },
            { name: "Aromatherapy", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/6.+Aromatherapy.png", isAvailable: true  },
            { name: "Other", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Other.png", isAvailable: true  }
        ]
    },
    {
        id: 3,
        service: "Bridal Services",
        sub_services: [
            { name: "Featured", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Featured.png", isAvailable: true  },
            { name: "Bridal Dressing", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/1.+Bridal+Dressing.png", isAvailable: true  },
            { name: "Pre-wedding Skincare", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/2.+Pre-wedding+Skincare.png", isAvailable: true  },
            { name: "Bridal Packages", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/3.+Bridal+Packages.png", isAvailable: true  },
            { name: "Groom Dressing", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/4.+Groom+Dressing.png", isAvailable: true  },
            { name: "Normal Dressing", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/5.+Normal+dressing.png", isAvailable: true  },
            { name: "Other", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Other.png", isAvailable: true  }
        ]
    },
    {
        id: 4,
        service: "Cosmetic Services",
        sub_services: [
            { name: "Featured", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Featured.png", isAvailable: true  },
            { name: "Skin Care", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/1.+Skin+Care.png", isAvailable: true  },
            { name: "Advanced Skin Treatments", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/2.+Advanced+Skin+Treatments.png", isAvailable: true  },
            { name: "Cosmetic Surgeries", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/3.+Cosmetic+Surgeries.png", isAvailable: true  },
            { name: "Beauty Consultations", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/4.+Beauty+Consultations.png", isAvailable: true  },
            { name: "Body Contouring", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/5.+Body+Contouring.png", isAvailable: true  },
            { name: "Other", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Other.png", isAvailable: true  }
        ]
    },
    {
        id: 5,
        service: "Therapy",
        sub_services: [
            { name: "Featured", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Featured.png", isAvailable: true  },
            { name: "Ayurveda", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/1.+AYURVEDA.png", isAvailable: true  },
            { name: "Mental Wellness", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/2.+Mental+wellness.png", isAvailable: true  },
            { name: "Counseling", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/3.+Counseling.png", isAvailable: true  },
            { name: "Alternative Therapies", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/4.+Alternative+Therapies.png", isAvailable: true  },
            { name: "Lifestyle Coaching", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/5.+Lifestyle+Coaching.png", isAvailable: true  },
            { name: "Other", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Other.png", isAvailable: true  }
        ]
    },
    {
        id: 6,
        service: "Fitness",
        sub_services: [
            { name: "Featured", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Featured.png", isAvailable: true  },
            { name: "Personal Training", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/1.+Personal+Training.png", isAvailable: true  },
            { name: "Yoga Classes", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/2.+Yoga+Classes.png", isAvailable: true  },
            { name: "Group Fitness", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/3.+Group+Fitness.png" , isAvailable: true },
            { name: "Nutritional Counseling", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/4.+Nutritional+Counselling.png", isAvailable: true  },
            { name: "Wellness Programs", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/5.+Wellness+Programs.png", isAvailable: true  },
            { name: "Other", image: import.meta.env.VITE_PROVIDER_SERVICE_IMAGE_URL +"black_line_package_types/Other.png", isAvailable: true  }
        ]
    }
  ];

export function getSalonSubServices(selectedServices: number) {
    let result: {
        name: string;
        image: string;
        isAvailable: boolean;
    }[] = [];

    const serviceName = bookmeiBeautySearvices.find(s => s.id === selectedServices)?.name;

    // Loop through the selected services
   
        const service = beautyServiceSubServices.find(s => s.service === serviceName);

        if (service) {
            result = result.concat(service.sub_services);
            // remove dubplicates
            result = result.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i)

        }
    

    return result;
}