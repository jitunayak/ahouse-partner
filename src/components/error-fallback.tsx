import YourSvg from "../assets/error.svg";

type IProps = {
  type?: "permission" | "default";
};
export function ErrorFallback({ type = "default" }: IProps) {
  return (
    <div className="flex flex-1 w-full justify-center ">
      {type === "default" && (
        <div className="flex flex-col items-center justify-center gap-4">
          <img src={YourSvg} alt="error" className="w-[200px]" />
          <div className="text-lg">Something went wrong!</div>
        </div>
      )}
      {type === "permission" && (
        <div className="text-lg">Permission Denied</div>
      )}
    </div>
  );
}
