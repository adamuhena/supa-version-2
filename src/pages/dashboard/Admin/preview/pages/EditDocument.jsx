import PageLayout from "../../../../../components/layout/pageLayout"
import { DotPattern } from "../../../../../components/ui/dot-pattern"
import DocumentForm from "../components/DocumentForm"
import DocumentLayout from "../components/document-layout"

function EditDocument() {
  // Helper function for class names
  const cn = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
        <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

        <section className="bg-slate-900 pt-32 pb-10">
          <div className="container mx-auto px-4">
            <div className="inline-block rounded-lg bg-muted px-6 md:px-16 py-5 text-2xl md:text-3xl font-bold text-emerald-600">
              Edit Document
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DocumentLayout>
            <DocumentForm />
          </DocumentLayout>
        </div>
      </div>
    </PageLayout>
  )
}

export default EditDocument





// import PageLayout from "../../../../../components/layout/pageLayout"
// import { DotPattern } from "../../../../../components/ui/dot-pattern"
// import DocumentForm from "../components/DocumentForm"

// function EditDocument() {
//   // Helper function for class names
//   const cn = (...classes) => {
//     return classes.filter(Boolean).join(" ")
//   }

//   return (
//     <PageLayout>
//       <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//         <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

//         <section className="bg-slate-900 pt-32 pb-10">
//           <div className="container mx-auto px-4">
//             <div className="inline-block rounded-lg bg-muted px-6 md:px-16 py-5 text-2xl md:text-3xl font-bold text-emerald-600">
//               Edit Document
//             </div>
//           </div>
//         </section>

//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <DocumentForm />
//         </div>
//       </div>
//     </PageLayout>
//   )
// }

// export default EditDocument

