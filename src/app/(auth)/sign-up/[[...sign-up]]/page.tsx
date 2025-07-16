import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-100 via-background-200/20 to-background-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100/10 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-100 mb-2 gradient-text">
            Join NoteMaker
          </h1>
          <p className="text-text-200">
            Start your note-taking journey today
          </p>
        </div>
        <div className="glass rounded-2xl p-1">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-2xl border-0 bg-background-200/90 backdrop-blur-sm rounded-xl",
                headerTitle: "text-text-100",
                headerSubtitle: "text-text-200",
                socialButtonsBlockButton: "bg-background-300 hover:bg-background-300/80 text-text-100 border-background-300",
                formButtonPrimary: "bg-primary-100 hover:bg-primary-200 text-text-100",
                formFieldInput: "bg-background-300 border-background-300 text-text-100",
                footerActionLink: "text-primary-100 hover:text-primary-200",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}