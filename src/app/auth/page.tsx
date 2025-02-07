import SignIn from "./sign-in";
import { SignUp } from "./sign-up";

function Page() {
  return (
    <div className="flex justify-evenly">
      <SignIn />
      <SignUp />
    </div>
  );
}

export default Page;
