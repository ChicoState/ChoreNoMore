import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wqamrjqdnsnboscermtz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxYW1yanFkbnNuYm9zY2VybXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc2MDU0MjQsImV4cCI6MTk5MzE4MTQyNH0.pI8ucJfxK3Qgx1oGoZRXfYpzIjoxwY2_BqXH0qls7jA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)