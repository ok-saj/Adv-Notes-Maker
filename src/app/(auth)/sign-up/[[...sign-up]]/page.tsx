import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Join NoteMaker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your note-taking journey today
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl border-0 bg-white/80 backdrop-blur-sm",
            },
          }}
        />
      </div>
    </div>
  );
}