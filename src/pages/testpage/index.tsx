import UploadButton from "../../components/UploadButton";

const TestPage = () => {
  const doSomething = (newFileUrl) => {
    console.log("newFileUrl", newFileUrl);
  };

  return (
    <div>
      <h1>
        <UploadButton handleFileChange={doSomething} />
      </h1>
    </div>
  );
};
export default TestPage;
