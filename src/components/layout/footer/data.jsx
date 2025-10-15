import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
export const footerLinks = [
  [
    {
      header: true,
      title: "QUICK LINKS",
    },
    { title: "Home", path: "/" },
    { title: "About Us", path: "/about" },
    { title: "MarketPlace", path: "/marketplace" },
    { title: "Beneficiaries / Registered Artisans", path: "/beneficiaries" },
    { title: "Contact ", path: "/contact" },
    { title: "ITF ", path: "https://itf.gov.ng/" },
  ],

  [
    {
      header: true,
      title: "LEGAL",
    },
    {
      title: "Terms & Condition",
      path: "/",
    },

    {
      title: "Privacy Policy",
      path: "/",
    },
  ],
];

export const socialLinks = [
  {
    label: "FACEBOOK",
    url: "https://facebook.com",
    img: <img src={"/icons/facebook.svg"} alt={"socail_label"} />,
  },

  {
    label: "INSTAGRAM",
    url: "https://instagram.com",
    img: (
      <div className="h-[40px] w-[40px] border border-white rounded-full flex items-center justify-center text-white ">
        <InstagramLogoIcon className="text-inherit" />
      </div>
    ),
  },

  {
    label: "LinkedIn",
    url: "https://linkedin.com",
    img: (
      <div className="h-[40px] w-[40px] border border-white rounded-full flex items-center justify-center text-white ">
        <LinkedInLogoIcon className="text-inherit" />
      </div>
    ),
  },

  {
    label: "WHATSAPP",
    url: "https://whatsapp.com",
    img: <img src={"/icons/whastapp.svg"} alt={"socail_label"} />,
  },
];
