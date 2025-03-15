"use client"
import { useNavigate } from "react-router-dom"
import PageLayout from "../../../../../components/layout/pageLayout"
import { DotPattern } from "../../../../../components/ui/dot-pattern"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import DocumentList from "../components/DocumentList"
import { useToast } from "@/hooks/use-toast"

function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem("token")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    navigate("/")
  }

  // Helper function for class names
  const cn = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
        <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

        <section className="bg-slate-900 pt-32 pb-10">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="inline-block rounded-lg bg-muted px-6 md:px-16 py-5 text-2xl md:text-3xl font-bold text-emerald-600">
              Document Dashboard
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DocumentList />
        </div>
      </div>
    </PageLayout>
  )
}

export default Dashboard

