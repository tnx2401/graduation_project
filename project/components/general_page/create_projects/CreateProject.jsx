import React, { useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CreateProject = ({ enterpriseId, setIsAddingNewProject }) => {
  const [step, setStep] = useState(1);
  const [generalInfo, setGeneralInfo] = useState({
    enterpriseId: enterpriseId,
  });

  console.log(generalInfo);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white p-6 w-1/2 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium border-b border-gray-300 pb-3">
            Bước {step}:{" "}
            {step === 1
              ? "Thông tin cơ bản"
              : step === 2
              ? "Chọn ảnh cho dự án"
              : step === 3
              ? "Chọn vị trí dự án"
              : step === 4
              ? "Hoàn tất thiết lập dự án"
              : ""}
          </h1>
          <XMarkIcon
            className="w-6 h-6"
            onClick={() => setIsAddingNewProject(false)}
          />
        </div>
        {step === 1 && (
          <Step1
            setStep={setStep}
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
          />
        )}
        {step === 2 && (
          <Step2
            setStep={setStep}
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
          />
        )}
        {step === 3 && (
          <Step3
            setStep={setStep}
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
          />
        )}
        {/* {step === 4 && <Step4 generalInfo={generalInfo} />} */}
      </div>
    </div>
  );
};

export default CreateProject;
