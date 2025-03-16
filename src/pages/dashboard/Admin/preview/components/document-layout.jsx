"use client"

import { DocumentProvider } from "../contexts/DocumentContext"

function DocumentLayout({ children }) {
  return <DocumentProvider>{children}</DocumentProvider>
}

export default DocumentLayout

