 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }
 
   try {
     const { username, password, phone } = await req.json();
     
     if (!username || !password) {
       throw new Error('Username and password are required');
     }
 
     const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
     const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
     
     const supabase = createClient(supabaseUrl, serviceRoleKey, {
       auth: {
         autoRefreshToken: false,
         persistSession: false
       }
     });
 
     const internalEmail = `${username.toLowerCase()}@raithupaalu.local`;
 
     // Create user with admin API
     const { data: authData, error: authError } = await supabase.auth.admin.createUser({
       email: internalEmail,
       password: password,
       email_confirm: true,
       user_metadata: {
         username: username,
         phone: phone || ''
       }
     });
 
     if (authError) {
       console.error('Auth error:', authError);
       throw authError;
     }
 
     const userId = authData.user.id;
     console.log('User created with ID:', userId);
 
     // Update role to admin
     const { error: roleError } = await supabase
       .from('user_roles')
       .update({ role: 'admin' })
       .eq('user_id', userId);
 
     if (roleError) {
       console.error('Role update error:', roleError);
       throw roleError;
     }
 
     console.log('Admin role assigned successfully');
 
     return new Response(
       JSON.stringify({ success: true, userId, message: 'Admin account created successfully' }),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
     );
 
   } catch (error) {
     console.error('Error creating admin:', error);
     return new Response(
       JSON.stringify({ success: false, error: error.message }),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
     );
   }
 });