import React from "react";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { TreeView } from '@material-ui/lab';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from '@material-ui/lab/TreeItem';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';

const RenderBuildTree = ({data}) => {
    return data.map( row => {
        if(typeof row.children !== 'undefined' && row.children.length > 0)    {
            return (
                <TreeItem nodeId={row.id} label={row.name}>
                    <RenderBuildTree data={row.children} />
                </TreeItem>
            )
        }   else {
            return <TreeItem nodeId={row.id} label={row.name} />
        }
    })
}

const MerchantTreeView = ({data, handleSelect, selected}) => {
    // const [expanded, setExpanded] = React.useState([]);

    // const handleToggle = (event, nodeIds) => {
    //     setExpanded(nodeIds);
    // };
    // const handleExpandClick = () => {
    //     setExpanded((oldExpanded) =>
    //       oldExpanded.length === 0 ? ['allprograms', '1', '2', '3', '4', '5', '6', '7'] : [],
    //     );
    //   };
    // const handleSelect = (event, nodeIds) => {
    //     alert(nodeIds)
    //     setSelected(nodeIds);
    // };
    return (
        <List>
            <div className="text-left">
            {/* Tree Structure */}
            {/* <Box sx={{ mb: 1 }}>
                <Button onClick={handleExpandClick}>
                    {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                </Button>
            </Box> */}
                <TreeView
                    aria-label="controlled"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultExpanded={['all']} //all is the ID of the parent node
                    // expanded={expanded}
                    // onNodeToggle={handleToggle}
                    onNodeSelect={handleSelect}
                    defaultSelected={selected ? selected : null}
                    multiSelect
                >
                    <TreeItem nodeId="allprograms" label="Merchants" disableSelection={true}>
                        <RenderBuildTree data={data} />
                    </TreeItem>
                </TreeView>
            </div>
        </List>
    )
}

export default MerchantTreeView;