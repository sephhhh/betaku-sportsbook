import { createClient as supabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  return supabaseClient(supabaseUrl, supabaseKey);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
      return
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/auth/auth-code-error')
}

export async function register(userEmail, userPassword) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password: userPassword,
    options: {
      emailRedirectTo: 'http://localhost:3000/dashboard',
    },
  })
}

export async function signInWithEmail(userEmail, userPassword) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: userPassword,
  })

  if (error) {
    console.error('Sign-in error:', error);
    return;
  }
}