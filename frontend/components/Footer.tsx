// components/Footer.tsx
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DeVote</h3>
            <p className="text-gray-300">
              A decentralized voting platform built on blockchain technology,
              ensuring transparency, security, and trust in the democratic process.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/voting" className="text-gray-300 hover:text-white transition-colors">
                  Vote Now
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-gray-300 hover:text-white transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@devote.example</li>
              <li>Discord: DeVote Community</li>
              <li>Twitter: @DeVote_app</li>
            </ul>
          </div>
        </div> */}

        {/* <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400"> */}
        <div className="mt-8 pt-6 text-center">
          <p>&copy; {currentYear} DeVote. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
