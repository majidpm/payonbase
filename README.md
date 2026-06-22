# PayOnBase24 💰

> The All-in-One USDC Payment Platform on Base Network

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Network](https://img.shields.io/badge/Network-Base-0052FF?logo=ethereum)](https://base.org/)
[![Backend](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://vercel.com/)
[![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-4CAF50?logo=android)]()

---

## 📖 About

**PayOnBase24** is a comprehensive crypto payment platform built on the **Base Network** that combines multiple financial tools in one place. From instant payment links to donation pages, travel funds, and expense splitting — everything you need to manage crypto payments.

Whether you're a content creator, freelancer, traveler, or business owner, PayOnBase24 provides the tools you need to receive, manage, and split USDC payments seamlessly.

### 🎯 What Makes Us Different?

- 🌐 **Public Profiles** — Get your own page at `/u/yourname`
- 💝 **Donation System** — Receive tips directly to your wallet
- ✈️ **Travel Funds** — Crowdfund trips with progress tracking
- 🧮 **Split Expenses** — Automatically calculate who owes what
- 🔗 **PayLinks** — One-time payment links with QR codes
- 📱 **Mobile-First** — Fully responsive design
- 🛡️ **Secure** — RLS policies, wallet signing, and input validation

---

## ✨ Features

### 💳 PayLink System
| Feature | Description |
|---------|-------------|
| 🔗 **Instant Links** | Generate unique payment links in seconds |
| 📱 **QR Codes** | Scan with phone for easy payments |
| 🔒 **One-Time Use** | Links expire after payment |
| 👁️ **Privacy** | Recipient address hidden from payers |
| 📊 **Dashboard** | Manage all your payment links |

### 💝 Donation System
| Feature | Description |
|---------|-------------|
| 👤 **Public Profiles** | Personal donation page at `/u/username` |
| 💰 **Direct Payments** | USDC sent directly to your wallet |
| 🎁 **Quick Amounts** | Pre-set buttons (1, 5, 10, 25 USDC) |
| 💬 **Messages** | Donors can leave messages |
| 🏆 **Top Supporters** | Showcase your biggest donors |
| 📊 **Analytics** | Track total raised, donor count, top donor |
| 🔍 **Filters & Search** | Filter by time, sort by amount |

### ✈️ Travel Fund
| Feature | Description |
|---------|-------------|
| 🎯 **Goal Tracking** | Set target amount with progress bar |
| 🔗 **Public Links** | Shareable links at `/trip/slug` |
| 💸 **Contributions** | Anyone can contribute any amount |
| 📈 **Real-time Updates** | Live progress tracking |
| 🎉 **Completion Alerts** | Notification when goal is reached |

### 🧮 Split Expenses
| Feature | Description |
|---------|-------------|
| 👥 **Group Management** | Add members to your group |
| 💵 **Expense Tracking** | Record who paid for what |
| 💳 **Pre-paid Support** | Account for money already paid |
| 🧮 **Auto-Calculation** | Automatically calculate balances |
| 📊 **Balance Overview** | See who owes what |

### 🌐 Public Profiles
| Feature | Description |
|---------|-------------|
| 🎨 **Customizable** | Username, display name, bio |
| 📱 **Social Links** | Twitter, Instagram, GitHub, Telegram, YouTube, Discord, Website |
| 🏆 **Verified Badge** | Show your profile is authentic |
| 📊 **Stats Display** | Show total donations and count |
| 🎁 **Donation Form** | Integrated donation system |

### 🔐 Security & Privacy
| Feature | Description |
|---------|-------------|
| 🔒 **RLS Policies** | Row Level Security for data isolation |
| ✍️ **Wallet Signing** | 1-hour validity signatures |
| ✅ **Input Validation** | Ethereum address format validation |
| 🛡️ **Rate Limiting** | Prevent spam and abuse |
| 🔑 **Supabase Auth** | Secure email/password & Google OAuth |
| 🌐 **HTTPS Only** | Enforced secure connections |

### 🎨 User Experience
| Feature | Description |
|---------|-------------|
| 🌙 **Dark/Light Mode** | Persistent theme preference |
| 📱 **Mobile Responsive** | Optimized for all screen sizes |
| 🎯 **Sidebar Navigation** | Clean, organized menu structure |
| ⚡ **Fast Loading** | Vite-powered instant updates |
| 🎨 **Modern UI** | Beautiful gradients and animations |

---
PayOnBase24
├── 📱 Public Pages (No Auth Required)
│ ├── /u/:username → Public Profile + Donation
│ ├── /pay/:slug → One-time Payment Link
│ └── /trip/:slug → Travel Fund Contribution
│
├── 🔐 Private Pages (Auth Required)
│ ├── / → Create PayLink
│ ├── /dashboard → Manage PayLinks
│ ├── /donation → Donation Dashboard
│ ├── /travel → Travel Fund & Split Expenses
│ └── /settings → Profile & Wallet Settings
│
└── 🎨 Components
├── Navbar → Mobile-responsive top bar
├── SidebarLayout → Desktop sidebar navigation
└── ThemeContext → Dark/Light mode management



---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
|------------|-------------|
| ⚛️ **React 18** | UI Framework |
| ⚡ **Vite** | Build Tool |
| 🎨 **Tailwind CSS** | Styling |
| 🔀 **React Router** | Navigation |
| 🟣 **Ethers.js v6** | Blockchain Interaction |
| 📦 **React QR Code** | QR Code generation |

### Backend
| Technology | Description |
|------------|-------------|
| 🗄️ **Supabase** | Authentication & Database |
| 🔐 **RLS** | Row Level Security Policies |
| 📦 **PostgreSQL** | Database |
| ⚡ **Edge Functions** | Serverless Functions (future) |

### Blockchain
| Technology | Description |
|------------|-------------|
| ⛓️ **Base Network** | Layer 2 Ethereum |
| 💵 **USDC** | Payment Token (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) |
| 🦊 **MetaMask** | Wallet Integration |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- MetaMask or Web3 wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/majidpm/payonbase24.git
cd payonbase24

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Fill in your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev

Environment Variables
Create a .env file in the root directory:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key


### Available Scripts
```
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

```

🗄️ Database Schema
```
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  wallet_address TEXT,
  twitter TEXT,
  instagram TEXT,
  github TEXT,
  telegram TEXT,
  youtube TEXT,
  discord TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
Wallet Signatures Table
```
sql
CREATE TABLE wallet_signatures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text NOT NULL,
  signature text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '1 hour'),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);
```
Donations Table

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  donor_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  message TEXT,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

Profiles Table

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  wallet_address TEXT,
  twitter TEXT,
  instagram TEXT,
  github TEXT,
  telegram TEXT,
  youtube TEXT,
  discord TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

Travel Funds Table

CREATE TABLE travel_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  wallet_address TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

Travel Contributions Table

CREATE TABLE travel_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id UUID REFERENCES travel_funds(id) ON DELETE CASCADE,
  contributor_address TEXT NOT NULL,
  contributor_name TEXT,
  amount NUMERIC NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

Travel Splits Tables

CREATE TABLE travel_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  host_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE travel_split_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID REFERENCES travel_splits(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pre_paid NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE travel_split_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID REFERENCES travel_splits(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  paid_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

### 🔒 Security

Row Level Security (RLS)
Data isolation between users
Public read access for profiles and donations
Owner-only write access for private data
Wallet Verification
Cryptographic signatures with 1-hour validity
Domain-bound messages to prevent replay attacks
Address validation (Ethereum format)
Input Validation
Wallet address format checking
Amount validation (positive numbers only)
Username format validation (3-20 chars, alphanumeric)
Bio length limits (500 chars)
Authentication
Supabase Auth with JWT tokens
Email/password + Google OAuth
Secure password reset flow
Network Security
Chain ID verification (Base Network only)
HTTPS enforcement
Secure environment variables

### 🚢 Deployment
Deploy on Vercel
Push code to GitHub

Import repository in Vercel

Add environment variables

Deploy

Environment Variables (Vercel)
Name	                            Value
VITE_SUPABASE_URL         	   Your Supabase URL
VITE_SUPABASE_ANON_KEY	      Your Supabase Anon Key

----------------
🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing)

Open a Pull Request

### 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2024 PayOnBase24

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
🙏 Acknowledgments
Base Network — Ethereum L2 blockchain

Supabase — Backend as a Service

Vercel — Hosting platform

Tailwind CSS — Utility-first CSS framework

Ethers.js — Ethereum library

React — UI framework
------------
📬 Contact
Project Links
GitHub: https://github.com/majidpm/payonbase24

Live demo :

**🔗 [Visit PayOnBase24](https://payonbase24.vercel.app)**

Social Media
Email: majid.pmn1@gmail.com

GitHub: @majidpm

Issues & Support
Report Issue: GitHub Issues
--------
## 💰 Donate

If you find this project useful, you can support it by sending USDC on Base Network:

| Network | Token | Address |
|---------|-------|---------|
| **Base** | USDC | `0x4D0ce11bafE6fCBD4506A24B52D2b63b688C8332` |

> ⚠️ Make sure you're on **Base Network**. Sending to the wrong network may result in loss of funds.

**Other ways to support:**
- ⭐ Star this repo
- 📤 Share with others
- 🐛 Report issues

---

Phase 1 ✅ (Completed)
PayLink system with QR codes
User authentication
Dashboard for payment management
Wallet signing verification
Dark/Light mode
Phase 2 ✅ (Completed)
Public profiles with social links
Donation system
Donation dashboard with analytics
Mobile responsive design
Advanced settings
Phase 3 ✅ (Completed)
Travel fund system
Split expenses calculator
Sidebar navigation
Public fund links
Phase 4 🚧 (In Progress)
Transaction verification via Basescan API
Email notifications
Export data to CSV
Advanced analytics charts
Phase 5 📋 (Planned)
Multi-wallet support
Recurring donations
NFT integration
Mobile app (React Native)

📊 Project Stats
Total Features: 30+
Database Tables: 8
Pages: 10
Components: 15+
Lines of Code: 5000+


Made with ❤️ on Base Network


PayOnBase24 — The future of crypto payments is here! 🚀
