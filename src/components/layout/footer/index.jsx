import { footerLinks, socialLinks } from "./data";
import { DotPattern } from "../../ui/dot-pattern";
import { cn } from "../../../lib/utils";

function Footer() {
  return (
    <div className="relative bg-slate-900 py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <DotPattern
        width={10}
        height={10}
        cx={1}
        cy={1}
        cr={1}
        className={cn("fill-neutral-600/40 opacity-15")}
      />
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo and Contact Section */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="p-3 bg-white rounded-lg w-fit">
              <img 
                className="w-24 h-auto" 
                src="/supaLogo.png" 
                alt="SUPA Logo" 
              />
            </div>

            <div className="flex flex-col space-y-4 text-center md:text-left">
              {[
                {
                  title: "supasec@itf.gov.ng",
                  path: "mailto:supasec@itf.gov.ng",
                },
                {
                  title: "Industrial Training Fund – Along Miango Road, P.M.B 2199 Jos, Plateau State, Nigeria. 930272",
                },
                {
                  title: "+2348138202997",
                  path: "tel:+2348138202997",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.path || "#"}
                  className="text-white text-sm hover:text-yellow-400 transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:col-span-2">
            {footerLinks.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="flex flex-col space-y-4"
              >
                {column.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.path || "#"}
                    className={`
                      text-white text-sm 
                      ${item.header 
                        ? 'text-emerald-500 font-semibold' 
                        : 'hover:text-yellow-400 transition-colors'}
                    `}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-sm text-white text-center md:text-left">
            © {new Date().getFullYear()} - SUPA
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            <a
              href="/terms-and-conditions"
              className="text-sm text-white hover:text-yellow-400 transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href="/privacy-policy"
              className="text-sm text-white hover:text-yellow-400 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;