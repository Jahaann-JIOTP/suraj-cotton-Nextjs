import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

class Div extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  toggleExpand = () => {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }));
  };

  render() {
    const { id, title, children, length, height, date_select, hide } =
      this.props;
    const { expanded } = this.state;
    return (
      <div
        id={id}
        className={`relative w-full sm:w-full md:w-[46%] ${length} max-md:!h-[200px] mb-[0.6vw] rounded-xl shadow-md ${
          expanded
            ? "absolute top-0 left-0 w-full h-screen z-[999] bg-white"
            : ""
        }`}
        style={{
          height: expanded ? "100%" : height,
          width: expanded ? "100%" : "",
          position: expanded ? "fixed" : "",
          zIndex: expanded ? "999" : "",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        {/* Background Layer with opacity */}
        <div
          className="absolute inset-0 bg-white rounded-xl h-full w-full"
          style={{ opacity: 1 }}
        />

        {/* Content Layer */}
        <div className="relative text-[#626469] p-4 z-10 h-full w-full">
          <div className="absolute top-2 right-2 mr-2">
            <div className="float-right cursor-pointer">
              {date_select}
              <FontAwesomeIcon
                icon={faExpand}
                onClick={this.toggleExpand}
                className={hide}
              />
            </div>
          </div>

          <div className="absolute top-2 left-4">
            <p className="text-[0.9vw] max-md:text-[12px] font-bold">{title}</p>
          </div>

          {children}
        </div>
      </div>
    );
  }
}

export default Div;
