# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Database and Security

### Supabase Setup

This application uses Supabase for backend services. Make sure to set up your Supabase project and configure the environment variables in `.env.local`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=<configure-in-environment>
```

### Database Migrations

The application uses Supabase migrations to manage the database schema. The following migrations should be applied in order:

1. `20250401000000_profiles_table.sql` - Creates the profiles table
2. `20250912000000_fix_profiles_rls_recursion.sql` - Fixes infinite recursion issue in profiles table policies

### Row Level Security (RLS) Policies

The database tables use Row Level Security (RLS) policies to control access to data. Special attention should be paid to avoid infinite recursion in policies, particularly in the `profiles` table.

#### Profiles Table Policy Fix

A specific issue was identified with the `profiles` table where a policy was causing infinite recursion:

**Problematic Policy:**
```sql
-- This policy caused infinite recursion
CREATE POLICY "Admins can manage all profiles" 
ON profiles FOR ALL 
TO public 
USING ((SELECT profiles_1.role FROM profiles profiles_1 WHERE profiles_1.id = auth.uid()) = 'admin'::text);
```

**Solution:**
To fix this, a helper function `is_admin_user()` was created to avoid direct self-referencing queries:

```sql
-- Helper function to avoid recursion
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fixed policy using helper function
CREATE POLICY "Admins can manage all profiles" 
ON profiles FOR ALL 
TO public 
USING (is_admin_user());
```

This migration is included in `supabase/migrations/20250912000000_fix_profiles_rls_recursion.sql` and should be applied to all new deployments.

### User Profile Management

The application automatically creates user profiles when users register or log in. If you have existing users without profiles, you can initialize them using the admin panel at `/admin/init-db` or `/admin/init-profiles`.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.