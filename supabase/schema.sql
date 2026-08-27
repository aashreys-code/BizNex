-- ============================================
-- BizNex - Supabase Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- Profiles table (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  email text not null default '',
  mobile text default '',
  village text default '',
  district text default '',
  state text default '',
  language text default 'english',
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Admin can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- Reports table
-- ============================================
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  report_type text not null check (report_type in (
    'market_analysis', 'business_plan', 'scheme_finder',
    'loan_calculation', 'funding_advisor', 'insights'
  )),
  title text not null default '',
  generated_data jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reports enable row level security;

create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create policy "Users can create own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own reports"
  on public.reports for delete
  using (auth.uid() = user_id);

-- ============================================
-- Government Schemes table
-- ============================================
create table public.schemes (
  id uuid default uuid_generate_v4() primary key,
  scheme_name text not null,
  description text default '',
  eligibility_criteria jsonb default '{}',
  benefits text default '',
  max_loan_amount text default '',
  interest_rate text default '',
  required_documents text[] default '{}',
  application_process text default '',
  application_link text default '',
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.schemes enable row level security;

-- Everyone can view active schemes
create policy "Anyone can view active schemes"
  on public.schemes for select
  using (status = 'active');

-- Only admins can manage schemes
create policy "Admins can insert schemes"
  on public.schemes for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update schemes"
  on public.schemes for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete schemes"
  on public.schemes for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- Business Ideas table
-- ============================================
create table public.business_ideas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  business_type text not null,
  business_idea text default '',
  location text default '',
  investment_amount numeric default 0,
  analysis jsonb default '{}',
  status text default 'draft' check (status in ('draft', 'analyzed', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.business_ideas enable row level security;

create policy "Users can manage own business ideas"
  on public.business_ideas for all
  using (auth.uid() = user_id);

-- ============================================
-- Chat History table
-- ============================================
create table public.chat_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  messages jsonb default '[]',
  language text default 'english',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_history enable row level security;

create policy "Users can manage own chat history"
  on public.chat_history for all
  using (auth.uid() = user_id);

-- ============================================
-- Documents table
-- ============================================
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  document_type text not null check (document_type in (
    'aadhaar', 'pan', 'business_registration',
    'address_proof', 'income_certificate', 'other'
  )),
  file_name text not null,
  file_url text default '',
  file_size numeric default 0,
  verification_status text default 'pending' check (verification_status in (
    'pending', 'verifying', 'verified', 'issue'
  )),
  verification_notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;

create policy "Users can manage own documents"
  on public.documents for all
  using (auth.uid() = user_id);

-- ============================================
-- Loan Applications table
-- ============================================
create table public.loan_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  monthly_income numeric default 0,
  existing_loans numeric default 0,
  business_type text default '',
  investment_requirement numeric default 0,
  eligibility_score numeric default 0,
  eligible_amount numeric default 0,
  estimated_emi numeric default 0,
  status text default 'pending' check (status in ('pending', 'submitted', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.loan_applications enable row level security;

create policy "Users can manage own loan applications"
  on public.loan_applications for all
  using (auth.uid() = user_id);

-- Admin can view all loan applications
create policy "Admins can view all loan applications"
  on public.loan_applications for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- Indexes for performance
-- ============================================
create index idx_reports_user_id on public.reports(user_id);
create index idx_reports_type on public.reports(report_type);
create index idx_business_ideas_user_id on public.business_ideas(user_id);
create index idx_chat_history_user_id on public.chat_history(user_id);
create index idx_documents_user_id on public.documents(user_id);
create index idx_loan_applications_user_id on public.loan_applications(user_id);
create index idx_schemes_status on public.schemes(status);

-- ============================================
-- Function to handle new user signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, ''),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Function to update updated_at timestamp
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger update_schemes_updated_at
  before update on public.schemes
  for each row execute function public.update_updated_at();

create trigger update_business_ideas_updated_at
  before update on public.business_ideas
  for each row execute function public.update_updated_at();

create trigger update_chat_history_updated_at
  before update on public.chat_history
  for each row execute function public.update_updated_at();

-- ============================================
-- Insert default government schemes
-- ============================================
insert into public.schemes (scheme_name, description, benefits, max_loan_amount, interest_rate, required_documents, application_process, application_link) values
('PMEGP', 'Prime Ministers Employment Generation Programme', 'Government subsidy of 25-35% on project cost for micro enterprises', '₹25,00,000', '4-8% per annum (subsidized)', ARRAY['Aadhaar Card', 'PAN Card', 'Project Report', 'Caste Certificate (if applicable)', 'Education Qualification Certificate'], 'Apply online through KVIC portal or District Industries Center', 'https://www.kvic.org.in'),
('MUDRA Loan', 'Micro Units Development & Refinance Agency', 'Collateral-free loan up to ₹10 lakh for non-farm income generating activities', '₹10,00,000', '8-12% per annum', ARRAY['Aadhaar Card', 'PAN Card', 'Business Plan/Project Report', 'Address Proof', 'Photographs'], 'Apply through participating banks, NBFCs, or online via Udyamimitra portal', 'https://www.udyamimitra.in'),
('Stand-Up India', 'Stand-Up India Scheme for SC/ST and Women', 'Bank loans between ₹10 lakh to ₹1 crore for greenfield enterprises', '₹1,00,00,000', '8.5-11% per annum', ARRAY['Aadhaar Card', 'PAN Card', 'Caste Certificate', 'Business Plan', 'Education Certificate', 'Experience Certificate'], 'Apply through scheduled commercial banks', 'https://www.standupmitra.in'),
('PM SVANidhi', 'PM Street Vendors Atmanirbhar Nidhi', 'Working capital loan of up to ₹50,000 for street vendors with interest subvention', '₹50,000', '0% for first ₹10,000 (with digital transactions)', ARRAY['Aadhaar Card', 'Vending Certificate/Identity Card', 'Photograph'], 'Apply online through PM SVANidhi portal or mobile app', 'https://pmsvanidhi.mohua.gov.in'),
('NRLM', 'National Rural Livelihood Mission', 'Promotes self-employment and self-help groups with subsidized credit', '₹3,00,000', 'Subsidized rate through SHG linkage', ARRAY['Aadhaar Card', 'SHG Registration Certificate', 'Bank Passbook', 'BPL Certificate'], 'Contact district rural livelihood mission office or block mission management unit', 'https://aajeevika.gov.in'),
('CGTMSE', 'Credit Guarantee Fund Trust for MSME', 'Collateral-free credit to MSMEs up to ₹5 crore', '₹5,00,00,000', '8-12% per annum', ARRAY['Aadhaar Card', 'PAN Card', 'Business Registration', 'GST Registration', 'Last 3 years ITR', 'Project Report'], 'Apply through lending banks and financial institutions registered with CGTMSE', 'https://www.cgtmse.in');
