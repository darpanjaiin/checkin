const SUPABASE_URL = 'https://bapfyaocnysnyeeexmig.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhcGZ5YW9jbnlzbnllZWV4bWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNjE2MjEsImV4cCI6MjA1MDkzNzYyMX0.651acsnbmZ-1GF6MfZ-FSfaGSzQF4wsJKHAu25w43R8'

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Add error handling for initialization
if (!supabase) {
    console.error('Failed to initialize Supabase client')
}

// Add request interceptor for error handling
supabase.rest.interceptors.response.use(
    response => response,
    error => {
        console.error('Supabase API Error:', error)
        return Promise.reject(error)
    }
)

// Make it available globally
window.supabase = supabase