import React, { useState } from "react";
import * as viewer from "react-svg-pan-zoom";

export type GraphViewerProps = {
  className?: string;
  width: number;
  height: number;
  children?: React.ReactNode;
};

const GraphViewer: React.FC<GraphViewerProps> = ({
  className,
  width,
  height,
  children,
}) => {
  const [tool, setTool] = useState<viewer.Tool>(viewer.TOOL_NONE);
  const [value, setValue] = useState<viewer.Value>(
    // They forget this member, so I have to hack.
    (viewer as any).INITIAL_VALUE
  );
  return (
    <viewer.ReactSVGPanZoom
      className={className}
      width={width}
      height={height}
      tool={tool}
      onChangeTool={setTool}
      value={value}
      onChangeValue={setValue}
    >
      {children}
    </viewer.ReactSVGPanZoom>
  );
};

export default GraphViewer;
