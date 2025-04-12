// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
// import { Eye } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export const FilePreview = ({ fileUrl, buttonText = "Preview Document" }) => {
//   if (!fileUrl) return null;
//   const renderPreview = (url) => {
//     const fileType = url.split('.').pop().toLowerCase();
    
//     switch(fileType) {
//       case 'pdf':
//         return (
//           <iframe
//             src={`${url}#view=FitH`}
//             type="application/pdf"
//             width="100%"
//             height="600px"
//             style={{ border: 'none' }}
//           />
//         );
//       case 'doc':
//       case 'docx':
//         return (
//           <iframe
//             src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
//             width="100%"
//             height="600px"
//             style={{ border: 'none' }}
//           />
//         );
//       case 'jpg':
//       case 'jpeg':
//       case 'png':
//         return (
//           <img 
//             src={url} 
//             alt="Document Preview" 
//             className="max-h-[80vh] w-auto object-contain"
//           />
//         );
//       default:
//         return <div>Unsupported file type</div>;
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="mt-2">
//           <Eye className="h-4 w-4" />
//           Preview Document
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-4xl">
//         {renderPreview(fileUrl)}
//       </DialogContent>
//     </Dialog>
//   );
// };

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const FilePreview = ({ fileUrl, buttonText = "Preview Document" }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!fileUrl) return null;

  const renderPreview = (url) => {
    // Handle case where URL might have query parameters
    const fileExtension = url.split('.').pop().split('?')[0].toLowerCase();
    
    switch(fileExtension) {
      case 'pdf':
        return (
           
         
          <div className="w-full h-[80vh]">
            {isClient && (
              <iframe
                src={`${url}#toolbar=0&navpanes=0`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="PDF Preview"
              />
              

            )}
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            title="Word Document Preview"
          />
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img 
            src={url} 
            alt="Document Preview" 
            className="max-h-[80vh] w-auto object-contain mx-auto"
          />
        );
      case 'xls':
      case 'xlsx':
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            title="Excel Preview"
          />
        );
      default:
        return (
          <div className="p-4 text-center">
            <p>Unsupported file type</p>
            <a 
              href={url} 
              download
              className="text-blue-600 hover:underline"
            >
              Download file instead
            </a>
          </div>
        );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        {renderPreview(fileUrl)}
      </DialogContent>
    </Dialog>
  );
};