import { loggedInProtectedPage } from '@/lib/page-protection';
import SubmitUpdateForm from '@/components/SubmitUpdateForm';
import { auth } from '@/lib/auth';

const SubmitUpdate = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  return (
    <main>
      <SubmitUpdateForm />
    </main>
  );
};

export default SubmitUpdate;
