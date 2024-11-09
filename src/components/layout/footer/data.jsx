import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
export const footerLinks = [
  [
    {
      header: true,
      title: "QUICK LINKS",
    },
    { title: "Home", path: "/" },
    { title: "About Us", path: "/" },
    { title: "Management Team", path: "/" },
    { title: "Gallery", path: "/" },
    { title: "Testimonies", path: "/" },
    { title: "News", path: "/" },
    { title: "Contact ", path: "/" },
  ],

  [
    {
      header: true,
      title: "OUR PROGRAMMES",
    },
    {
      title: "FCT Home Grown School Feeding (FCT-HGSF) Programme",
      path: "/programmes/fct-home-grown-school-feeding-programme",
    },

    {
      title: "Government Enterprise and Empowerment Programme (GEEP)",
      path: "/programmes/fct-home-grown-school-feeding-programme",
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
