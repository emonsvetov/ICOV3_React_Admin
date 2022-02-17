import React from "react";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { TreeView } from '@material-ui/lab';
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TreeItem from '@material-ui/lab/TreeItem';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';

const RenderBuildTree = ({data}) => {
    return data.map( row => {
        if(typeof row.subRows !== 'undefined' && row.subRows.length > 0)    {
            return (
                <TreeItem nodeId={row.id} label={row.name}>
                    <RenderBuildTree data={row.subRows} />
                </TreeItem>
            )
        }   else {
            return <TreeItem nodeId={row.id} label={row.name} />
        }
    })
}

const ProgramTreeView = ({data, handleSelect, selected}) => {
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
                    defaultCollapseIcon={<ArrowDownIcon className="arrowIcon" />}
                    defaultExpandIcon={<ArrowRightIcon className="arrowIcon" />}
                    sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    defaultEndIcon={<ArrowRightIcon className="arrowIcon" />}
                    defaultExpanded={['allprograms']} //all is the ID of the parent node
                    // expanded={expanded}
                    // onNodeToggle={handleToggle}
                    onNodeSelect={handleSelect}
                    defaultSelected={selected ? selected : null}
                >
                    <TreeItem nodeId="allprograms" label="All Programs" disableSelection={true}>
                        <RenderBuildTree data={data} />
                    </TreeItem>
                </TreeView>
            </div>
        </List>
    )
}

export default ProgramTreeView;