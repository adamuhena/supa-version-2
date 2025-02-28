import Globe from "../../../components/ui/globe";

function ReadySection() {
  return (
    <>
      <main className="relative mt-[300px] w-full bg-[#DEF2F9] px-5 pb-[40px] pt-[231px] max-lg:mt-[150px] max-lg:pt-[150px]">
        <div className="absolute left-0 top-0 flex w-full items-start justify-center">
          <Globe className="top-[-190px] max-w-[400px]" />
        </div>

        <section className="mx-auto flex h-[auto] w-full max-w-screen-xl flex-wrap items-center justify-between gap-[69px] rounded-[16px] bg-[#00524D] bg-cover px-[20px] max-lg:py-[60px] lg:h-[431px] lg:px-[103px]">
          <div className="flex max-w-[585.43px] flex-col gap-[16px]">
            <h1 className="font-bricolage_grotesque text-[clamp(36px,calc(50/1216*100vw),50px)] font-[700] leading-[clamp(39px,calc(55/1216*100vw),55px)] text-white max-lg:text-center">
              Transform Community Health Today
            </h1>
            <p className="font-onest text-[clamp(16px,calc(18/1216*100vw),18px)] font-normal leading-[clamp(22px,calc(27/1216*100vw),27px)] text-white max-lg:text-center">
              Get the CHT app today and streamline community healthcare
              services. Register now and enhance care coordination, data
              management, and patient outcomes.
            </p>
          </div>

          <a href={"/auth/login"}>
            <button>GET STARTED</button>
            {/* <Button
              title="Get Started"
              variant="azure"
              className="px-[47px] max-lg:mx-auto"
            /> */}
          </a>
        </section>
      </main>
    </>
  );
}

export default ReadySection;
