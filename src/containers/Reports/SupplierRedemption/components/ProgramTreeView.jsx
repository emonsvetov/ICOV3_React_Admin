import React from "react";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { Checkbox, FormControlLabel } from "@material-ui/core";
// import {data} from './sampleData'

export default function ProgramTreeView({merchants, selected, setSelected}) {

  const data = {
    id: "",
    name: "Select All",
    children: merchants
  }

  // const [selected, setSelected] = React.useState([]);
  const [traverse, setTraverse] = React.useState(true);
  // console.log(selected);

  // form.change("merchant_id", selected);

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const parentMap = React.useMemo(() => {
    return goThroughAllNodes(data);
  }, []);

  // console.log("parentMAp", parentMap);

  function goThroughAllNodes(nodes, map = {}) {
    if (!nodes.children || nodes.children.length <=0 ) {
      return null;
    }

    // console.log(nodes.children)

    map[nodes.id] = getAllChild(nodes).splice(1);

    for (let childNode of nodes.children) {
      goThroughAllNodes(childNode, map);
    }

    return map;
  }

  // Get all children from the current node.
  function getAllChild(
    childNode = null,
    collectedNodes = []
  ) {
    if (childNode === null) return collectedNodes;

    collectedNodes.push(childNode.id);

    if (Array.isArray(childNode.children)) {
      for (const node of childNode.children) {
        getAllChild(node, collectedNodes);
      }
    }

    return collectedNodes;
  }

  const getChildById = (nodes, id) => {
    let array = [];
    let path = [];

    // recursive DFS
    function getNodeById(node, id, parentsPath) {
      let result = null;

      if (node.id === id) {
        return node;
      } else if (Array.isArray(node.children)) {
        for (let childNode of node.children) {
          result = getNodeById(childNode, id, parentsPath);

          if (!!result) {
            parentsPath.push(node.id);
            return result;
          }
        }

        return result;
      }

      return result;
    }

    const nodeToToggle = getNodeById(nodes, id, path);
    // console.log(path);

    return { childNodesToToggle: getAllChild(nodeToToggle, array), path };
  };

  function getOnChange(checked, nodes) {
    const { childNodesToToggle, path } = getChildById(data, nodes.id);

    if( traverse )  {
      let array = checked
        ? [...selected, ...childNodesToToggle]
        : selected
            .filter((value) => !childNodesToToggle.includes(value))
            .filter((value) => !path.includes(value));
      array = array.filter((v, i) => array.indexOf(v) === i);
      setSelected(array);
    } else  {
      let array = checked ? [...selected, ...[nodes.id]] : selected.filter( (v, i) => v !== nodes.id );
      setSelected(array);
    }
  }

  const renderTree = (nodes) => {

    let indeterminate = null;
    let checked = selectedSet.has(nodes.id)
    
    if( traverse )  {
      const allSelectedChildren = parentMap[
        nodes.id
      ]?.every((childNodeId) => selectedSet.has(childNodeId));
      checked = selectedSet.has(nodes.id) || allSelectedChildren || false;

      indeterminate = 
        parentMap[nodes.id]?.some((childNodeId) =>
          selectedSet.has(childNodeId)
        ) || false;

      if (allSelectedChildren && !selectedSet.has(nodes.id)) {
        // console.log("if allSelectedChildren");
        setSelected([...selected, nodes.id]);
      }
    }

    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                indeterminate={!checked && indeterminate}
                onChange={(event) =>
                  getOnChange(event.currentTarget.checked, nodes)
                }
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={<>{nodes.name}</>}
            key={nodes.id}
          />
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={[]}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(data)}
      </TreeView>
    </>
  );
}
