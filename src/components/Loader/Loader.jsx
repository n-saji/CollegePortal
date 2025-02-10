import "./Loader.css";
export const LoaderOverlay = (props) => {
  return (
    <>
      <div className="loader_div">
        <div className="loader"></div>
        {props.text && <div className="loader_text">{props.text}</div>}
      </div>
    </>
  );
};
