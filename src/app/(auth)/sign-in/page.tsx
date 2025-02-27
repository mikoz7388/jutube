import SignIn from "../../../modules/auth/sign-in";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  return <SignIn redirectTo={searchParams.redirectTo ?? "/"} />;
}

export default Page;
