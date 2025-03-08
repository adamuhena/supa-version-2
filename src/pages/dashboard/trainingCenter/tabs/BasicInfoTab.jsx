import { Input } from "@/components/ui/input"
import { TabsContent } from "@/components/ui/tabs";

const BasicInfoTab = ({ center, handleInputChange, handleSubmit }) => {
  return (
    <TabsContent value="basic">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="trainingCentreName"
          value={center.trainingCentreName}
          onChange={handleInputChange}
          placeholder="Training Centre Name"
        />
        <Input
          name="regNum"
          value={center.regNum}
          onChange={handleInputChange}
          placeholder="Registration Number"
        />
        <Input
          name="email"
          type="email"
          value={center.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <Input
          name="phoneNumber"
          value={center.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
        />
      </form>
    </TabsContent>
  )
}

export default BasicInfoTab