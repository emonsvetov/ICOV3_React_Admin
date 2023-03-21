import React, {useEffect} from "react";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { TreeView } from '@material-ui/lab';
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TreeItem from '@material-ui/lab/TreeItem';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';

let expandedList = [];
const makeExpandedList = (data) => {
    if( !data || !data?.length > 0) return;
    data.map( item => {
        // console.log(item)
        expandedList.push(item.id)
        if( item?.subRows && typeof item.subRows === 'object' && item.subRows.length > 0)   {
            // alert("Here")
            makeExpandedList(item.subRows)
        }
    })
}

const RenderBuildTree = ({data}) => {
    return data.map( row => {
        if(typeof row.subRows !== 'undefined' && row.subRows.length > 0)    {
            return (
                <TreeItem disableSelection={true} nodeId={row.id} label={row.name}>
                    <RenderBuildTree data={row.subRows} />
                </TreeItem>
            )
        }   else {
            return <TreeItem nodeId={row.id} label={row.name} />
        }
    })
}

const ProgramTreeView = ({data, handleSelect, selected, rootNode = true}) => {
    const [expanded, setExpanded] = React.useState([]);
    useEffect( () => {
        // if( !rootNode )  {
        //     setExpanded([data[0].id])
        // }
        if( data ) {
            // console.log(data)
            expandedList = [];
            makeExpandedList(data)
            if( rootNode )    {
                expandedList.push('allprograms')
            }
            setExpanded(expandedList)
        }
    }, [rootNode, data])

    if( !data ) return 'Loading...'
    // console.log(expanded)
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
                    // defaultExpanded={expanded} //all is the ID of the parent node
                    expanded={expanded}
                    // onNodeToggle={handleToggle}
                    onNodeSelect={handleSelect}
                    defaultSelected={selected ? selected : null}
                >
                    {rootNode && 
                    <TreeItem nodeId="allprograms" label="All Programs" disableSelection={true}>
                        <RenderBuildTree data={data} />
                    </TreeItem>}

                    {!rootNode && 
                        <RenderBuildTree data={data}/>
                    }
                </TreeView>
            </div>
        </List>
    )
}

export default ProgramTreeView;