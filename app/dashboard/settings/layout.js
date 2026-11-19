import DashBread from "@/components/dashboard/DashBread";
import Tabs from "@/components/dashboard/settings/Tabs";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
//export const instant = false;

const layout = ({ children }) => {
  return (
    <main className="flex flex-col gap-4">
      <section className="">
        <DashBread title="Settings" />
      </section>
      <section className="bg-base-200 p-5 rounded-md inset-shadow-sm">
        {children}
      </section>
    </main>
  );
};

export default layout;
