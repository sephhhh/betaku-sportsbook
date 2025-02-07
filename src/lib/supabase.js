import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function loginWithGoogle() {  
  const { user, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000/dashboard`,
    },
  });

  if (error) {
    console.error('Error signing in:', error);
    return;
  }

  // The user object contains user details such as email
  console.log('User signed in:', user);
}

async function getUserEmail() {
  const user = supabase.auth.user(); // Get the currently authenticated user

  if (user) {
    return user.email; // Return the email if the user is authenticated
  } else {
    throw new Error("User not authenticated"); // If no user is authenticated, throw an error
  }
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
      console.log(error)
      // redirect user to specified redirect URL or root of app
      redirect(next)
      return
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/auth/auth-code-error')
}

export async function register(userEmail, userPassword) {
  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password: userPassword,
    options: {
      emailRedirectTo: 'http://localhost:3000/dashboard',
    },
  })

  if (error) {
    throw error.message; // Propagate the error for handling
  }

  return data; // Return user data on success
}

export async function login(userEmail, userPassword) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: userPassword,
  })

  if (error) {
    return Promise.reject(error.toString());
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: 'local' })
}

export default supabase;
