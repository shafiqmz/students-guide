import Lottie from "lottie-react";
import animationData from "/public/Lotties/server-error.json";

export default function ServerErrorLottie({height}) {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Lottie
        animationData={animationData}
        className="flex justify-center items-center"
        loop={true}
        style={{height: height}}
      />
    </div>
  );
}