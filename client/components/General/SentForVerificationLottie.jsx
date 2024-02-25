import Lottie from "lottie-react";
import animationData from "/public/Lotties/verification.json";

export default function SentForVerificationLottie({height}) {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Lottie
        animationData={animationData}
        className="flex justify-center items-center"
        loop={false}
        style={{height: height}}
      />
    </div>
  );
}