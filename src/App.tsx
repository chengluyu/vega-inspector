import React, { useState } from "react";
import { View } from "vega-typings";
import { exportScene } from "./helpers/scenegraph";
import { vega2dot } from "./helpers/vega2dot";
import { VegaWrapper } from "./components/VegaWrapper";
import { SceneGraphInsepector } from "./components/SceneGraphInspector";
import styled from "styled-components";
import EditorPanel from "./components/EditorPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";
import defaultSpec from "./examples/bar-chart.json";
import FloatingButton from "./components/FloatingButton";
import brandImage from "./images/favicon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Panel,
  PanelHeader,
  PanelContent,
  EmptyStatus,
} from "./components/common";
import DataFlowGraphPanel from "./components/DataFlowGraphPanel";
import TutorialPopup from "./components/TutorialPopup";

const AppHeader = styled.nav.attrs({ className: "bg-gray-900" })`
  grid-column: 1 / span 2;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  color: white;
`;

const AppFooter = styled.footer.attrs({ className: "bg-gray-900" })`
  grid-column: 1 / span 2;
  width: 100%;
`;

const AppLayout = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: 3rem minmax(0, 1fr) minmax(0, 1fr) 1.5rem;
  // overflow: hidden;
`;

const App: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [view, setView] = useState<View | null>(null);
  const [sceneGraph, setSceneGraph] = useState<object | null>(null);
  const [dataFlow, setDataFlow] = useState<string | null>(null);
  const [spec, setSpec] = useState(JSON.stringify(defaultSpec, undefined, 2));
  const [specDirty, setDirty] = useState(true);
  // Reference: https://sung.codes/blog/2018/09/29/resetting-error-boundary-error-state/
  const [errorBoundaryKey, setErrorBoundaryKey] = useState(0);

  const updateDisplay = (): void => {
    if (view !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const internalSceneGraph = (view as any)["_scenegraph"];
      setDataFlow(vega2dot(spec));
      setSceneGraph(exportScene(internalSceneGraph.root));
    }
  };

  return (
    <>
      <AppLayout>
        <AppHeader>
          <img className="mr-2 h-6 w-6" src={brandImage} alt="Vega Inspector" />
          <span className="text-xl font-bold">Vega Inspector</span>
          <button
            className="ml-auto px-2 py-1 bg-gray-200 text-gray-900 rounded shadow transition duration-150 hover:gray-100"
            onClick={() => setShowTutorial(!showTutorial)}
          >
            <FontAwesomeIcon icon="question-circle" fixedWidth />
            Tutorials
          </button>
        </AppHeader>
        <Panel>
          <PanelHeader className="uppercase">Source Code</PanelHeader>
          <PanelContent className="relative">
            <EditorPanel
              onVisualize={(source) => {
                setDirty(true);
                setSpec(source);
                setErrorBoundaryKey(errorBoundaryKey + 1);
              }}
            />
          </PanelContent>
        </Panel>
        <Panel className="relative border-l border-gray-400">
          <PanelHeader className="uppercase">Visualization</PanelHeader>
          <PanelContent className="flex justify-center items-center bg-gray-200 overflow-auto">
            <ErrorBoundary key={errorBoundaryKey}>
              <VegaWrapper
                spec={spec}
                onNewView={(view): void => {
                  console.log("A new view was created");
                  if (specDirty) {
                    setView(view);
                    setDirty(false);
                  }
                }}
              />
            </ErrorBoundary>
          </PanelContent>
          <FloatingButton onClick={updateDisplay}>
            <FontAwesomeIcon className="mr-1" icon="diagnoses" fixedWidth />
            Analyze
          </FloatingButton>
        </Panel>
        <Panel>
          <PanelHeader className="uppercase">Scene Graph</PanelHeader>
          <PanelContent padded>
            {sceneGraph === null ? (
              <EmptyStatus>
                Click “Analyze” to extract scene graph and display here
              </EmptyStatus>
            ) : (
              <SceneGraphInsepector sceneGraph={sceneGraph} expandLevel={2} />
            )}
          </PanelContent>
        </Panel>
        <DataFlowGraphPanel source={dataFlow} />
        <AppFooter />
      </AppLayout>
      <TutorialPopup
        show={showTutorial}
        onClose={() => setShowTutorial(!showTutorial)}
      />
    </>
  );
};

export default App;
