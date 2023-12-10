import React,{FC} from 'react';
import {any} from "prop-types";
import SupplierRedemptionSubIndex from "./components/SupplierRedemptionSubIndex";

interface SupplierRedemptionSubProgramProps {
    program: any
}

const SupplierRedemptionSubProgram: FC<SupplierRedemptionSubProgramProps> = ({program}) => {
    return (
        <SupplierRedemptionSubIndex programid={program.id}/>
    )
}

export default SupplierRedemptionSubProgram;
