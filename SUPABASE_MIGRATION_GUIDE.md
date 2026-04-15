# Migration to Supabase - Complete Setup Guide

## What's Been Changed

✅ **Prisma Schema**: Updated from MySQL to PostgreSQL  
✅ **Package Dependencies**: Removed `mysql2` driver  
✅ **Account Creation**: Fixed email validation bugs  
✅ **Error Handling**: Added transaction safety for clinic registration

## Step-by-Step Setup

### 1. Create Supabase Project (5 minutes)

If you don't have Supabase yet:
- Go to [supabase.com](https://supabase.com)
- Click "Sign Up" → Create account
- Create a new project with:
  - **Project Name**: medappoint2 (or your choice)
  - **Password**: Save this somewhere secure
  - **Region**: Choose closest to your users

### 2. Get Your Database Connection String (2 minutes)

1. Go to Supabase Dashboard → Your Project
2. Click **Settings** (bottom left) → **Database**
3. Under "Connection string" section, select **Connection parameters** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
   ```

### 3. Update Your .env File

Replace the placeholders in your `.env` file:

```bash
# Find this line:
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST].supabase.co:5432/postgres"

# Replace:
# [YOUR_PASSWORD] = Your Supabase database password
# [YOUR_HOST] = Your Supabase project host (e.g., abcxyzproject)
```

### 4. Install Dependencies

In your project terminal:
```bash
npm install
```

This will:
- Remove mysql2 dependency
- Install PostgreSQL drivers (bundled with Prisma)
- Regenerate Prisma client

### 5. Create Database Schema

Run this command to create all tables in Supabase:
```bash
npx prisma db push
```

This will:
- Create all tables (users, patients, doctors, clinics, etc.)
- Set up relationships and constraints
- Create indexes

### 6. Verify Setup

Test the connection with:
```bash
npx prisma studio
```

This opens a visual database explorer where you can:
- See all tables created
- View data
- Verify everything connected properly

### 7. Run Your App

Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing the Fixed Features

### Test Account Creation
1. Go to Register page
2. Try creating a new patient account
3. Email verification should work
4. Account should be created successfully

### Test Clinic Registration
1. Go to Register page
2. Select "Clinic" account type
3. Fill in clinic details
4. Should create clinic + admin account

### Test Email Verification
1. Try registering with an email
2. Check your email for verification code
3. Enter code when prompted
4. Account creation should proceed

## Troubleshooting

### Connection Refused Error
**Solution**: 
- Double-check connection string in .env
- Verify Supabase project is active
- Try clicking "Reset Database" in Supabase settings

### "Relations not found" Error
**Solution**:
```bash
npx prisma generate
npx prisma db push
```

### Email Not Sending
**Solution**:
- Verify SENDGRID_API_KEY is correct in .env
- Check inbox and spam folder
- Verify sender email (SENDGRID_FROM) is authorized

### Port 3000 Already in Use
**Solution**:
```bash
npm run dev -- --port 3001
```

## Migration from Clever Cloud (If needed)

If you need to migrate existing data from Clever Cloud:

1. **Export from Clever Cloud**:
   ```bash
   mysqldump -u [user] -p -h [host] [database] > backup.sql
   ```

2. **Convert MySQL dump to PostgreSQL** (if needed):
   - Use [pgloader](https://pgloader.io/) or
   - Manually recreate and migrate data

3. **Import to Supabase** (consult Supabase docs for your data migration)

## Files Modified

- `prisma/schema.prisma` - Changed provider to postgresql
- `package.json` - Removed mysql2 dependency
- `.env` - Updated DATABASE_URL template
- `src/app/api/auth/register-clinic/route.ts` - Fixed email validation
- `src/app/api/auth/register/route.ts` - Added error handling

## Next Steps

1. ✅ Configure .env with Supabase credentials
2. ✅ Run `npm install`
3. ✅ Run `npx prisma db push`
4. ✅ Test with `npm run dev`
5. ✅ Deploy to production when ready

## Support

For Supabase issues: https://supabase.com/docs  
For Prisma issues: https://www.prisma.io/docs/  
For Next.js issues: https://nextjs.org/docs/
