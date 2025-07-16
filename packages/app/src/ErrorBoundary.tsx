import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { TRPCClientError } from "@trpc/client"
import { RefreshCw } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "./AuthContext"

const ErrorBoundary = ({ error }: { error: Error }) => {
  const auth = useAuth();

  useEffect(() => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === 'UNAUTHORIZED' || error.data?.code === 'FORBIDDEN') {
        auth.logout()
      }
    }
  }, [error])

  if (error instanceof TRPCClientError) {
    if (error.data?.code === 'UNAUTHORIZED' || error.data?.code === 'FORBIDDEN') {
      return null
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold tracking-tight">
            Oops! An unexpected error happened.
          </h3>
          <p className="mt-4 text-muted-foreground">
            Please try refreshing your page.
          </p>
          <p className="mt-2 text-muted-foreground">
            If that doesn't work, please contact support at{" "}
            <a 
              href="mailto:help@squid.com" 
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            >
              help@squid.com
            </a>{" "}
            and provide the following error message:
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="error-details">
              <AccordionTrigger className="px-4">Error Excerpt</AccordionTrigger>
              <AccordionContent>
                <Alert variant="destructive" className="mx-4 mb-4">
                  <AlertTitle>Error Message</AlertTitle>
                  <AlertDescription className="mt-2">
                    <div className="overflow-auto font-mono text-sm">
                      <p>{error.message}</p>
                      <p className="mt-2 whitespace-pre-wrap">{error.stack}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    </div>
  )
}

export default ErrorBoundary
