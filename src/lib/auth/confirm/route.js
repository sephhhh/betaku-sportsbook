import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type'); // EmailOtpType is omitted as it's a TypeScript type
  const next = searchParams.get('next') || '/';

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirect user to the specified redirect URL or root of app
      redirect(next);
      return;
    }
  }

  // Redirect the user to an error page with some instructions
  redirect('/auth/auth-code-error');
}
