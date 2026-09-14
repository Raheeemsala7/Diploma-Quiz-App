import { Toaster } from "sonner"
import ReactQueryProvider from "./components/react-query-provider"
import NextAuthProvider from "./components/next-auth-provider"
import ThemeProvider from "./components/theme-provider"


export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ReactQueryProvider>
                <NextAuthProvider>
                    <Toaster richColors position="top-right" />
                    {children}
                </NextAuthProvider>
            </ReactQueryProvider>
        </ThemeProvider>
    )
}