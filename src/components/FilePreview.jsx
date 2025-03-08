import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const FilePreview = ({ fileUrl, buttonText = "Preview Document" }) => {
  if (!fileUrl) return null;
  const renderPreview = (url) => {
    const fileType = url.split('.').pop().toLowerCase();
    
    switch(fileType) {
      case 'pdf':
        return (
          <iframe
            src={`${url}#view=FitH`}
            type="application/pdf"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        );
      case 'doc':
      case 'docx':
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <img 
            src={url} 
            alt="Document Preview" 
            className="max-h-[80vh] w-auto object-contain"
          />
        );
      default:
        return <div>Unsupported file type</div>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2">
          Preview Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        {renderPreview(fileUrl)}
      </DialogContent>
    </Dialog>
  );
};