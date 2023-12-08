import React,{FC} from 'react';
import {any} from "prop-types";
import SupplierRedemptionIndex from "../../../../Reports/SupplierRedemption/components/SupplierRedemptionIndex";

interface SupplierRedemptionSubProgramProps {
    program: any
}

const SupplierRedemptionSubProgram: FC<SupplierRedemptionSubProgramProps> = ({program}) => {
    return (
        <SupplierRedemptionIndex programid={program.id}/>
    )
}

export default SupplierRedemptionSubProgram;
