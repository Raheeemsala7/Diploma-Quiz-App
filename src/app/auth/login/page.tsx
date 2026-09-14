import AuthHeading from "../_components/auth-heading"
import LoginForm from "@/src/features/auth/_components/loginForm"

const LoginPage = () => {
  return (
    <div className="space-y-8">
      <AuthHeading
        title="Welcome back"
        description="Sign in to pick up your exams and diplomas where you left off."
      />
      <LoginForm />
    </div>
  )
}

export default LoginPage