import GradText from "@/components/ui/GradText";
import TitleBanner from "@/components/ui/TitleBanner";
import { LuMail, LuPhone } from "react-icons/lu";

const page = () => {
  return (
    <main>
      <TitleBanner>Refund Policy</TitleBanner>
      <div className="max-w-[1426px] mx-auto px-5 py-10 sm:py-20">
        <div className="mb-10">
          <h2 className="text-3xl lg:text-5xl font-semibold text-center mb-3 text-balance max-w-xl mx-auto">
            Nexoro Solutions <GradText>Refund</GradText> Policy
          </h2>
          <p className="text-center">
            <b>Last Updated:</b> 20 November 2025
          </p>
        </div>

        <div className="bg-base-300 p-5 md:p-10 rounded-xl">
          <ol className="pl-10 *:list-decimal *:text-2xl *:font-semibold">
            <li>
              When Refund is Allowed
              <p className="font-normal text-base text-gray-400">
                Refund may be provided if work has not started or if delivery
                fails (unless delay caused by client).
              </p>
            </li>
            <br />
            <li>
              Non-Refundable Situations
              <p className="font-normal text-base text-gray-400">
                No refund after work begins, design dissatisfaction,
                unresponsiveness, or scope changes.
              </p>
            </li>
            <br />
            <li>
              Digital Product Refund
              <p className="font-normal text-base text-gray-400">
                No refund for delivered digital files such as logos, templates,
                or brand kits.
              </p>
            </li>
            <br />
            <li>
              Partial Refund
              <p className="font-normal text-base text-gray-400">
                May be issued case-by-case. Nexoro retains rights to unfinished
                work unless fully paid.
              </p>
            </li>
            <br />
            <li>
              Refund Processing Timeline
              <p className="font-normal text-base text-gray-400">
                Approved refunds processed within 5-10 business days
              </p>
            </li>
            <br />
            <li>
              Partial Refund
              <p className="font-normal text-base text-gray-400">
                May be issued case-by-case. Nexoro retains rights to unfinished
                work unless fully paid.
              </p>
            </li>
            <br />
            <li>
              Contact Information
              <ul className="*:font-normal *:text-base *:text-gray-400">
                <li className="flex items-center gap-2">
                  <LuMail /> your-email@example.com
                </li>
                <li className="flex items-center gap-2">
                  <LuPhone /> your-number
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
};

export default page;
