import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import RootLayout from "@/components/RootLayout";

function HomePage({ session }) {
  return (
    <RootLayout session={session}>
      {/* Your page content */}
    </RootLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context, authOption);

  return {
    props: {
      session,
    },
  };
}

export default HomePage;
