import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GovGuide AI - Citizen Welfare Schemes & Eligibility Assistant',
  description: 'Instant eligibility verification, required document checklists, and multi-language AI assistance for Indian Government Schemes.',
  keywords: ['GovGuide AI', 'PM-KISAN', 'Ayushman Bharat', 'Government Schemes', 'Eligibility Checker', 'Mudra Loan', 'Scholarship Portal', 'DBT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
