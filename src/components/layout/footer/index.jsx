import { footerLinks, socialLinks } from "./data";

function Footer() {
  return (
    <div className="widow-main bg-[#161616] pt-[100px] pb-[40px] px-[20px]">
      <div className="widow-inner flex flex-col lg:flex-row items-start gap-[44px] lg:gap-[32px] flex-wrap">
        <div className="flex flex-col items-left mx-auto lg:mx-0 max-w-[354px] gap-[32px]">
          <div className="p-[10px] bg-white w-fit rounded-[10px]">
            <img className="w-[100px]" src="/supaLogo.png" />
          </div>
          {/* <div className={"flex gap-[16px] items-center"}>
            {socialLinks.map((socail, idx) => (
              <a href={socail.url} key={`${idx}`} target="_blank">
                {socail.img}
              </a>
            ))}
          </div> */}

          <div className={"flex flex-col gap-[16px] items-start"}>
            {[
              {
                title: "supasec@itf.gov.ng",
                path: "malito:info@fct-sip.com.ng",
              },

              {
                title:
                  "Industrial Training Fund – Along Miango Road, P.M.B 2199 Jos, Plateau State, Nigeria. 930272",
              },

              {
                title: "+2348138202997, +2348138202997, +2348138202997",
                path: "tel:08160000000",
              },
            ].map((item, index) => {
              return (
                <a
                  key={item?.title}
                  href={item?.path ? item?.path : "#"}
                  className={
                    item?.header
                      ? "text-[#1b6f37] font-[500] text-[16px] leading-[24px] cursor-default"
                      : "text-[#ffffff] font-[400] text-[14px] leading-[22px flex items-center gap-3 hover:text-[#CDB972] cursor-pointer text-left"
                  }>
                  {item?.leftIcon ? (
                    <>
                      {typeof item?.leftIcon === "string" ? (
                        <img src={item?.leftIcon} />
                      ) : (
                        item?.leftIcon
                      )}
                    </>
                  ) : null}

                  <span>{item?.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row  w-full lg:w-auto flex-1  justify-center lg:justify-end gap-[32px] mx-auto lg:mx-0 flex-wrap lg:flex-nowrap">
          {footerLinks.map((column, index) => {
            return (
              <div
                key={`${index}`}
                className="flex flex-col items-start gap-[20px] w-full max-w-[181px]">
                {column.map((item) => {
                  return (
                    <a
                      key={item?.title}
                      href={item?.path ? item?.path : "#"}
                      className={
                        item?.header
                          ? "text-[#1b6f37] font-[500] text-[16px] leading-[24px] cursor-default"
                          : "text-[#ffffff] font-[400] text-[14px] leading-[22px flex items-center gap-3 hover:text-[#CDB972] cursor-pointer"
                      }>
                      {item?.leftIcon ? (
                        <>
                          {typeof item?.leftIcon === "string" ? (
                            <img src={item?.leftIcon} />
                          ) : (
                            item?.leftIcon
                          )}
                        </>
                      ) : null}

                      <span>{item?.title}</span>
                    </a>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="widow-inner flex flex-col flex-wrap items-center border-t border-t-[#5C5C5C] mt-[40px] pt-[40px] gap-[32px]">
        <div className="flex flex-col items-center gap-[20px]">
          <p className="text-[14px] leading-[22px] text-white">
            © {new Date().getFullYear()} - SUPA
          </p>
        </div>
        <div className="flex  flex-wrap  flex-1 justify-end gap-[32px]">
          <a
            href="/terms-and-conditions"
            className={
              "text-[#ffffff] font-[400] text-[14px] leading-[22px flex items-center gap-3 hover:text-[#CDB972] cursor-pointer"
            }>
            <span> Terms & Conditions</span>
          </a>

          <a
            href="/privacy-policy"
            className={
              "text-[#ffffff] font-[400] text-[14px] leading-[22px flex items-center gap-3 hover:text-[#CDB972] cursor-pointer"
            }>
            <span> Privacy Policy</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
