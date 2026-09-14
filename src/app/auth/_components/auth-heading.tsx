interface AuthHeadingProps {
  title: string
  description: string
}

/** Shared heading block for login and every registration step so both flows feel like one product. */
function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <header className="space-y-1.5">
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </header>
  )
}

export default AuthHeading