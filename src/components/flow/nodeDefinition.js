import { AddRounded, BalanceRounded, CloseRounded, ContentCutRounded, PublicRounded, RemoveRounded } from "@mui/icons-material";
import ComparatorNode from "./customNodes/ComparatorNode";
import DebugNode from "./customNodes/DebugNode";
import FunctionNode from "./customNodes/FunctionNode";
import TimerNode from "./customNodes/TimerNode";
import DivideNode from "./customNodes/operations/DivideNode";
import MultiplyNode from "./customNodes/operations/MultiplyNode";
import SubtractNode from "./customNodes/operations/SubtractNode";
import SumNode from "./customNodes/operations/SumNode";
import EqualsNode from "./customNodes/operations/EqualsNode";
import GlobalVarNode from "./customNodes/variables/GlobalVarNode";
import VariableNode from "./customNodes/variables/VariableNode";
import SignalNode from "./customNodes/variables/SignalNode";
import DemuxerNode from "./customNodes/operations/DemuxerNode";


/* ************************************************* */
/*       

How to define a new node:
    - Create the node file.js and add to getNodeTypes array
    - define it's type: name and others inside availableNode
    - define it's style in nodeStyles
    - if operation, define in the getOperation

*/
/* ************************************************* */

export const getNodeTypes = (updateNodeData) => ({
    ComparatorNode: (nodeProps) => <ComparatorNode updateNodeData={updateNodeData} conn {...nodeProps} />,
    TimerNode: (nodeProps) => <TimerNode updateNodeData={updateNodeData} {...nodeProps} />,
    FunctionNode: (nodeProps) => <FunctionNode updateNodeData={updateNodeData} {...nodeProps} />,
    DebugNode: (nodeProps) => <DebugNode updateNodeData={updateNodeData} {...nodeProps} />,
    SumNode: (nodeProps) => <SumNode updateNodeData={updateNodeData} {...nodeProps} />,
    SubtractNode: (nodeProps) => <SubtractNode updateNodeData={updateNodeData} {...nodeProps} />,
    DivideNode: (nodeProps) => <DivideNode updateNodeData={updateNodeData} {...nodeProps} />,
    MultiplyNode: (nodeProps) => <MultiplyNode updateNodeData={updateNodeData} {...nodeProps} />,
    EqualsNode: (nodeProps) => <EqualsNode updateNodeData={updateNodeData} {...nodeProps} />,
    GlobalVarNode: (nodeProps) => <GlobalVarNode updateNodeData={updateNodeData} {...nodeProps} />,
    VariableNode: (nodeProps) => <VariableNode updateNodeData={updateNodeData} {...nodeProps} />,
    SignalNode: (nodeProps) => <SignalNode updateNodeData={updateNodeData} {...nodeProps} />,
    DemuxerNode: (nodeProps) => <DemuxerNode updateNodeData={updateNodeData} {...nodeProps} />,
})

export const getAdditionalData = (type) => {
    const operationNodeType = {
        SumNode: { operation: 'sum' },
        MultiplyNode: { operation: 'multiply' },
        DivideNode: { operation: 'divide' },
        SubtractNode: { operation: 'subtract' },
        EqualsNode: { operation: 'equals', logic: '=' },
        GlobalVarNode: { type: 'FunctionNode', isPolling: 'true' },
        VariableNode: { type: 'FunctionNode', isPolling: 'false' },
        SignalNode: { type: 'FunctionNode', isPolling: 'true' },
        DemuxerNode: { type: 'FunctionNode', isPolling: 'false' },
    }
    return operationNodeType[type]
}

export const availableNode = {
    TimerNode: { name: "Timer", category: "default" },
    FunctionNode: { name: "Funciton", category: "default" },
    ComparatorNode: { name: "Comparator", category: "default" },
    DebugNode: { name: "Debugger", category: "default" },
    SumNode: { name: "Sum", category: "operation", icon: <AddRounded /> },
    DivideNode: { name: "Divide", category: "operation", icon: <ContentCutRounded /> },
    SubtractNode: { name: "Subtract", category: "operation", icon: <RemoveRounded /> },
    MultiplyNode: { name: "Multiply", category: "operation", icon: <CloseRounded /> },
    EqualsNode: { name: "Equals", category: "operation", icon: <BalanceRounded /> },
    GlobalVarNode: { name: "Global Var", category: "operation", icon: <PublicRounded /> },
    VariableNode: { name: "Variable", category: "operation", icon: <div className="font-bold font-mono">1</div> },
    SignalNode: { name: "Signal", category: "operation", icon: <div className="font-bold font-mono">~</div> },
    DemuxerNode: { name: "Demuxer", category: "operation", icon: <div className="font-bold font-mono">{"<"}</div> },
}



export const nodeStyles = {
    TimerNode: { backgroundColor: '#b5e2fa', borderRadius: "10px", transition: "background-color 0.3s" },
    FunctionNode: { backgroundColor: '#eddea4', borderRadius: "10px", transition: "background-color 0.3s" },
    ComparatorNode: { backgroundColor: '#f7a072', borderRadius: "10px", transition: "background-color 0.3s" },
    DebugNode: { backgroundColor: '#e9ff70', borderRadius: "10px", transition: "background-color 0.3s", },
    SumNode: { backgroundColor: '#e0e0e0', borderRadius: "10px", transition: "background-color 0.3s", },
    DivideNode: { backgroundColor: '#e0e0e0', borderRadius: "10px", transition: "background-color 0.3s", },
    SubtractNode: { backgroundColor: '#e0e0e0', borderRadius: "10px", transition: "background-color 0.3s", },
    MultiplyNode: { backgroundColor: '#e0e0e0', borderRadius: "10px", transition: "background-color 0.3s", },
    EqualsNode: { backgroundColor: '#e0e0e0', borderRadius: "10px", transition: "background-color 0.3s", },
    GlobalVarNode: { backgroundColor: '#5dc77a', borderRadius: "10px", transition: "background-color 0.3s", },
    VariableNode: { backgroundColor: '#5dc77a', borderRadius: "10px", transition: "background-color 0.3s", },
    SignalNode: { backgroundColor: '#5dc77a', borderRadius: "10px", transition: "background-color 0.3s", },
    DemuxerNode: { backgroundColor: '#5dc77a', borderRadius: "10px", transition: "background-color 0.3s", },
}
