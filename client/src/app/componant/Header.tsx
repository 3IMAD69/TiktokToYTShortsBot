import { Alert } from "@/components/ui/alert";
import Form from "./Form";
import StatusBar from "./StatusBar";

export const Header = () => {
    return (
      <section className="relative ">
        
      <div className="relative z-10 max-w-screen-xl  mx-auto px-4 py-28 md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
                
              <h2 className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-purple-500 font-extrabold mx-auto md:text-5xl">
                  Tiktok To Youtube Shorts 
              </h2>
              <p className="max-w-2xl mx-auto text-gray-400">
              Share your TikTok link with me, and I&apos;ll work my wizardry to transform it into an awesome YouTube short. Get ready for some digital magic that&apos;ll make your video shine and captivate the online world!
              <StatusBar />
              </p>
              <Form/>
             
          </div>
      </div>
      <div className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }}></div>
  </section>
    );
  };